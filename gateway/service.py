import serial
import serial.tools.list_ports
import json
import time
import os
import secrets
import requests
import hashlib
from web3 import Web3
from eth_account import Account

# --- ⚙️ CONFIGURATION (FILL THESE IN) ---
from dotenv import load_dotenv
load_dotenv()

# --- ⚙️ CONFIGURATION (FILL THESE IN) ---
BLOCKCHAIN_URL = os.getenv("BLOCKCHAIN_URL", "http://127.0.0.1:7545")
EMR_API_URL = os.getenv("EMR_API_URL", "http://localhost:8000/api/v1")

# 1. PASTE YOUR NEW CONTRACT ADDRESS HERE
# 1. PASTE YOUR NEW CONTRACT ADDRESS HERE
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# 2. PASTE PRIVATE KEY (Account 0 - Gateway Device)
PRIVATE_KEY = os.getenv("GATEWAY_PRIVATE_KEY")

# 3. SESSION WALLET (Privacy Mode)
# 3. SESSION WALLET (Fixed Demo Account - Index 3)
SESSION_PATIENT_ADDRESS = os.getenv("SESSION_PATIENT_ADDRESS")
SESSION_PATIENT_KEY = os.getenv("SESSION_PATIENT_KEY")

print(f"🔒 PRIVACY MODE ACTIVE: {SESSION_PATIENT_ADDRESS}")

# BATCH CONFIG
BATCH_SIZE_LIMIT = 50       # Upload after 50 readings
BATCH_TIME_LIMIT = 100       # Upload every 10 seconds if data exists
# ----------------------------------------

# Global Patient ID (fetched from EMR)
PATIENT_ID = None

def sync_patient():
    global PATIENT_ID
    print(f"🔄 Syncing Patient {SESSION_PATIENT_ADDRESS} with EMR...")
    try:
        # Check if exists
        resp = requests.get(f"{EMR_API_URL}/patients/by-wallet/{SESSION_PATIENT_ADDRESS}")
        if resp.status_code == 200:
            PATIENT_ID = resp.json()['id']
            print(f"   ✅ Patient Found! ID: {PATIENT_ID}")
        else:
            # Create
            print(f"   ⚠️ Patient not found. Registering...")
            new_patient = {
                "name": "Subir Nath Bhowmik", # Placeholder
                "age": 30,
                "wallet_address": SESSION_PATIENT_ADDRESS
            }
            create_resp = requests.post(f"{EMR_API_URL}/patients/", json=new_patient)
            if create_resp.status_code == 200:
                PATIENT_ID = create_resp.json()['id']
                print(f"   ✅ Patient Registered! ID: {PATIENT_ID}")
            else:
                print(f"   ❌ Failed to register patient: {create_resp.text}")
    except Exception as e:
        print(f"   ⚠️ EMR Sync Failed (System Offline): {e}")

# 1. Connect to Ganache
w3 = Web3(Web3.HTTPProvider(BLOCKCHAIN_URL))
if w3.is_connected():
    print(f"✅ Connected to Blockchain at {BLOCKCHAIN_URL}")
else:
    print("❌ Failed to connect to Ganache. Is it running?")
    exit()

# 2. Setup Contract
# Load ABI from Artifact
artifact_path = os.path.join(os.path.dirname(__file__), "../blockchain/artifacts/HealthRecord.json")
try:
    with open(artifact_path, "r") as f:
        artifact = json.load(f)
        abi = artifact["abi"]
except FileNotFoundError:
    print("❌ Artifact not found. Please run 'python blockchain/compile.py' first.")
    exit()

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)
gateway_account = w3.eth.account.from_key(PRIVATE_KEY)

# 3. Authorize Handshake (Patient authorizes Gateway) - FUNDING NEEDED
# Note: In a real mainnet, the patient needs ETH to pay for gas to authorize.
# On Ganache, we can send them some ETH from the Gateway first.
def authorize_handshake():
    print("🤝 Initiating Secure Handshake...")
    try:
        # A. Fund the Patient (Mocking 'Gas Station')
        print(f"   💸 Funding Patient session wallet...")
        tx_fund = {
            'to': SESSION_PATIENT_ADDRESS,
            'value': w3.to_wei(1, 'ether'),
            'gas': 21000,
            'gasPrice': w3.to_wei('20', 'gwei'),
            'nonce': w3.eth.get_transaction_count(gateway_account.address),
            'chainId': 1337
        }
        signed_fund = w3.eth.account.sign_transaction(tx_fund, PRIVATE_KEY)
        w3.eth.send_raw_transaction(signed_fund.raw_transaction)
        print("   ✅ Patient Funded.")
        time.sleep(1) # Wait for mining

        # B. Patient calls authorizeDevice(Gateway)
        print(f"   🔑 Authorizing Device {gateway_account.address}...")
        tx_auth = contract.functions.authorizeDevice(gateway_account.address).build_transaction({
            'from': SESSION_PATIENT_ADDRESS,
            'gas': 2000000,
            'gasPrice': w3.to_wei('20', 'gwei'),
            'nonce': w3.eth.get_transaction_count(SESSION_PATIENT_ADDRESS),
            'chainId': 1337
        })
        signed_auth = w3.eth.account.sign_transaction(tx_auth, SESSION_PATIENT_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_auth.raw_transaction)
        w3.eth.wait_for_transaction_receipt(tx_hash)
        print("   ✅ Device Authorized! Secure Link Established.")
        
    except Exception as e:
        print(f"   ❌ Handshake Failed: {e}")
        exit()

authorize_handshake()

# 3. Auto-Detect Arduino
def find_arduino():
    ports = list(serial.tools.list_ports.comports())
    for p in ports:
        # Common names for Arduino on different OS
        if any(x in p.description for x in ["Arduino", "CH340", "USB Serial", "usbmodem", "ttyACM"]):
            return p.device
    return None

arduino_port = find_arduino()
if arduino_port:
    print(f"✅ Found Arduino on {arduino_port}")
    ser = serial.Serial(arduino_port, 9600, timeout=1)
    ser.reset_input_buffer()
else:
    print("❌ Arduino not found! Plug it in and check connection.")
    # For testing without hardware, you might want to comment out the exit() and simulate data
    exit()

# Data Management
data_buffer = []
last_upload_time = time.time()

def upload_and_mint(batch_data, reason):
    print(f"\n🚀 TRIGGER: {reason} [{len(batch_data)} records]")
    
    if not batch_data:
        return

    # A. Calculate Real Cryptographic Hash (Integrity Proof)
    # We sign the specific data point that triggered the event (the last one)
    target_record = batch_data[-1] 
    
    # Format: "BPM-TIMESTAMP" (Simple deterministic format for demo)
    # in production, this would be the hash of the PDF file or entire dataset
    integrity_payload = f"{target_record.get('bpm')}-{target_record.get('timestamp')}"
    ipfs_hash = hashlib.sha256(integrity_payload.encode()).hexdigest()
    
    print(f"   🔐 Generating Proof for: '{integrity_payload}'")
    print(f"   📝 Calculated Hash: 0x{ipfs_hash[:10]}...")

    # B. Create the Batch File (Mocking IPFS Logic)
    filename = f"batch_{int(time.time())}.json"
    with open(filename, 'w') as f:
        json.dump(batch_data, f)
    print(f"   📦 IPFS Batch Created: {filename}")

    # C. Mint to Blockchain
    try:
        print("   ⚡ Sending to Blockchain...")
        tx = contract.functions.addRecord(
            SESSION_PATIENT_ADDRESS,
            ipfs_hash, # REAL HASH NOW
            reason == "CRITICAL" # True if Critical, False if Routine
        ).build_transaction({
            'chainId': 1337, # Standard Ganache Chain ID
            'gas': 2000000,
            'gasPrice': w3.to_wei('20', 'gwei'),
            'nonce': w3.eth.get_transaction_count(gateway_account.address)
        })
        
        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        print(f"   ✅ Transaction Confirmed! Hash: {w3.to_hex(tx_hash)}\n")
    except Exception as e:
        print(f"   ❌ Minting Failed: {e}")

    # D. Upload to EMR (SQL DB)
    global PATIENT_ID
    if not PATIENT_ID:
        sync_patient()

    if PATIENT_ID:
        print("   💾 Syncing to EMR Database...")
        try:
             # Sync all records, but attach the blockchain hash to them
             for reading in batch_data:
                 vitals_payload = {
                    "bpm": reading.get('bpm'),
                    "spo2": reading.get('spo2'),
                    "is_critical": (reading.get('bpm') > 140), 
                    "ipfs_hash": ipfs_hash, # Store the hash so we can verify later!
                    "timestamp": reading.get('timestamp')
                }
                 requests.post(f"{EMR_API_URL}/patients/{PATIENT_ID}/vitals/", json=vitals_payload)
             print(f"   ✅ Synced {len(batch_data)} records to EMR")
        except Exception as e:
            print(f"   ❌ EMR Sync Failed: {e}")

    # Cleanup
    if os.path.exists(filename):
        os.remove(filename)

# Initial Sync
sync_patient()

print("🏥 C.A.R.E. System Active. Waiting for vitals...\n")

# --- MAIN LOOP ---
while True:
    if ser.in_waiting > 0:
        try:
            line = ser.readline().decode('utf-8', errors='ignore').rstrip()
            if line:
                # print(f"DEBUG: {line}") 
                try:
                    data = json.loads(line)
                    bpm = data.get('bpm', 0)
                    
                    # Add to buffer
                    data['timestamp'] = time.time()
                    data_buffer.append(data)
                    
                    # Visual Feed
                    if bpm > 140:
                        print(f"🔴 CRITICAL: {bpm} BPM (Buffer: {len(data_buffer)})")
                    else:
                        print(f"🟢 Stable: {bpm} BPM (Buffer: {len(data_buffer)})", end='\r')

                    # LOGIC 1: CRITICAL BYPASS (Instant Mint)
                    if bpm > 140:
                        upload_and_mint(data_buffer, "CRITICAL")
                        data_buffer = [] # Reset
                        last_upload_time = time.time()
                    
                    # LOGIC 2: SIZE LIMIT (Batch Mint)
                    elif len(data_buffer) >= BATCH_SIZE_LIMIT:
                        upload_and_mint(data_buffer, "BATCH FULL")
                        data_buffer = [] # Reset
                        last_upload_time = time.time()

                except json.JSONDecodeError as je:
                    print(f"⚠️ JSON Parse Error: {je} | Raw: {line}")
                    ser.reset_input_buffer() # Flush to re-sync
                except Exception as e:
                    print(f"❌ Processing Error: {e}")

        except Exception as e:
            print(f"❌ Serial/IO Error: {e}")

    # LOGIC 3: TIME SYNC (Routine Mint)
    # If we have data and it's been >10 seconds, sync it.
    if len(data_buffer) > 0 and (time.time() - last_upload_time > BATCH_TIME_LIMIT):
        upload_and_mint(data_buffer, "TIME SYNC")
        data_buffer = [] # Reset
        last_upload_time = time.time()