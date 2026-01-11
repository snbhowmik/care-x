
import os
import sys

# Add the current directory to the path to import other modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import SessionLocal
import crud
import schemas

def show_records():
    db: Session = SessionLocal()
    try:
        print("--- Patients ---")
        patients = crud.get_patients(db, skip=0, limit=100)
        if not patients:
            print("No patients found.")
        else:
            for patient in patients:
                print(f"ID: {patient.id}, Name: {patient.name}, Age: {patient.age}, Wallet: {patient.wallet_address}")
                print("  Vitals:")
                vitals = crud.get_vitals(db, patient_id=patient.id)
                if not vitals:
                    print("    No vital records found for this patient.")
                else:
                    for vital in vitals:
                        print(f"    - BPM: {vital.bpm}, SpO2: {vital.spo2}, Timestamp: {vital.timestamp}")
        print("------------------")

    finally:
        db.close()

if __name__ == "__main__":
    show_records()
