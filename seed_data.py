import requests
import random
import time
import secrets
from eth_account import Account
import datetime

import os
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("EMR_API_URL", "http://localhost:8000/api/v1")

# Master List Construct from Env
MASTER_LIST = []
# Names mapping to recreate the structure
NAMES = [
    "Patient Zero", "Alice Wonderland", "Bob Builder", "Charlie Chaplin", 
    "David Bowie", "Eve Polastri", "Frank Castle", "Grace Hopper", 
    "Heidi Klum", "Ivan Drago"
]

for i in range(10):
    addr = os.getenv(f"GANACHE_ACCOUNT_{i}_ADDR")
    key = os.getenv(f"GANACHE_ACCOUNT_{i}_KEY")
    if addr and key:
        MASTER_LIST.append({
            "index": i, 
            "address": addr, 
            "key": key, 
            "name": NAMES[i]
        })

def wait_for_backend():
    print("⏳ Waiting for Backend to be ready...")
    for _ in range(30):
        try:
            resp = requests.get("http://localhost:8000/")
            if resp.status_code == 200:
                print("✅ Backend is ready!")
                return True
        except requests.exceptions.ConnectionError:
            pass
        time.sleep(1)
    print("❌ Backend failed to start.")
    return False

def seed():
    if not wait_for_backend():
        return

    print("🌱 Seeding Database with Master List Data...")

    for p in MASTER_LIST:
        payload = {
            "name": p["name"],
            "age": random.randint(25, 60),
            "wallet_address": p["address"]
        }
        
        # Check if exists or create
        try:
            print(f"   Processing Patient: {p['name']} ({p['address']})")
            
            # Try creating
            resp = requests.post(f"{API_URL}/patients/", json=payload)
            
            # If already exists (400), try fetching to get ID
            if resp.status_code != 200:
                # Assuming 400 means "Email/Wallet already registered" or similar.
                # Let's try to fetch by wallet to be sure we have the ID.
                # Note: The current API might not have a direct 'by-wallet' GET in the main router shown in previous context,
                # but let's assume standard behavior or the 'create' returns the existing object if handled gracefully.
                # If the previous code in service.py is correct, there is a GET /patients/by-wallet/{address}
                
                fetch_resp = requests.get(f"{API_URL}/patients/by-wallet/{p['address']}")
                if fetch_resp.status_code == 200:
                    patient_data = fetch_resp.json()
                    print(f"   -> Found existing ID: {patient_data['id']}")
                else:
                    print(f"   ⚠️ Could not create or find patient: {resp.text}")
                    continue
            else:
                patient_data = resp.json()
                print(f"   -> Created new ID: {patient_data['id']}")

            patient_id = patient_data['id']
                
            # Generate 5-6 random vitals
            num_records = random.randint(5, 6)
            print(f"   -> Generating {num_records} historical records...")
            
            for i in range(num_records):
                bpm = random.randint(60, 100)
                # occasional spike
                if i == num_records - 1 and random.choice([True, False]):
                     bpm = random.randint(110, 150)

                is_critical = bpm > 140
                
                # Random timestamp within last 7 days
                delta_seconds = random.randint(0, 7 * 24 * 3600) 
                timestamp = time.time() - delta_seconds
                
                vitals_payload = {
                    "bpm": bpm,
                    "spo2": random.randint(95, 100),
                    "is_critical": is_critical,
                    "timestamp": timestamp,
                    "ipfs_hash": f"QmSeedHash{random.randint(10000,99999)}",
                    "session_address": p["address"] # using master address as session for seed data
                }
                requests.post(f"{API_URL}/patients/{patient_id}/vitals/", json=vitals_payload)
            
            print(f"   ✅ Done for {p['name']}")
            
        except Exception as e:
            print(f"   ❌ Error processing {p['name']}: {e}")

    print("✅ Seeding Complete.")

if __name__ == "__main__":
    seed()
