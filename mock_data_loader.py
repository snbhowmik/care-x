import sqlite3
import random
from datetime import datetime, timedelta

import os
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION: YOUR NEW GANACHE ADDRESSES ---

# 🏥 Hospital Admin (Pays Gas) - Index 0
HOSPITAL_ADMIN = os.getenv("HOSPITAL_ADMIN_ADDRESS")

# 👨‍⚕️ Doctor (Authorizes Records) - Index 9
DOCTOR = os.getenv("DOCTOR_ADDRESS")

# 👤 Patients (The Data Owners) - Indices 1 to 8
PATIENTS = [
    {"addr": os.getenv("GANACHE_ACCOUNT_1_ADDR"), "name": "Aarav Sharma", "age": 34, "gender": "M"},
    {"addr": os.getenv("GANACHE_ACCOUNT_2_ADDR"), "name": "Priya Patel", "age": 28, "gender": "F"},
    {"addr": os.getenv("GANACHE_ACCOUNT_3_ADDR"), "name": "Rohan Gupta", "age": 45, "gender": "M"},
    {"addr": os.getenv("GANACHE_ACCOUNT_4_ADDR"), "name": "Ananya Singh", "age": 62, "gender": "F"},
    {"addr": os.getenv("GANACHE_ACCOUNT_5_ADDR"), "name": "Vikram Malhotra", "age": 29, "gender": "M"},
    {"addr": os.getenv("GANACHE_ACCOUNT_6_ADDR"), "name": "Sneha Reddy", "age": 31, "gender": "F"},
    {"addr": os.getenv("GANACHE_ACCOUNT_7_ADDR"), "name": "Mohammed Ali", "age": 55, "gender": "M"},
    {"addr": os.getenv("GANACHE_ACCOUNT_8_ADDR"), "name": "Kavya Iyer", "age": 24, "gender": "F"},
]

# --- MOCK MEDICAL DATA GENERATOR ---
RECORD_TYPES = [
    ("Blood Test", "Complete Blood Count (CBC) - Hemoglobin: 13.5 g/dL (Normal). WBC: 6000/mcL."),
    ("ECG Report", "Normal Sinus Rhythm, Rate 72 bpm. No ST elevation or T-wave inversion."),
    ("Radiology", "Chest X-Ray PA View: Clear lung fields, no consolidation or pleural effusion."),
    ("Operation Report", "Appendectomy: Post-Op Day 1. Patient stable, afebrile. Incision clean."),
    ("Pathology", "Biopsy Result: Benign tissue sample. No malignancy detected."),
    ("Cardiology", "2D Echo: LVEF 60%, mild mitral regurgitation. No wall motion abnormality."),
    ("Discharge Summary", "Admitted for Dengue Fever. Platelets recovered to 1.5L. Discharged on oral meds."),
    ("Vaccination", "COVID-19 Booster Dose (Pfizer) administered. Next due in 6 months."),
    ("MRI Scan", "MRI Brain: Normal study. No infarct or hemorrhage seen."),
    ("Dermatology", "Allergic Contact Dermatitis. Prescribed topical corticosteroids.")
]

def setup_database():
    print("🏥 Initializing Hospital Internal Database (SQL)...")
    
    # Connect to SQLite (Creates file if not exists)
    conn = sqlite3.connect('hospital.db')
    c = conn.cursor()

    # 1. CLEANUP (Drop old tables for fresh start)
    c.execute('DROP TABLE IF EXISTS medical_records')
    c.execute('DROP TABLE IF EXISTS patients')

    # 2. CREATE SCHEMA
    # Table: Patients (Links Wallet <-> Real Identity)
    c.execute('''
        CREATE TABLE patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wallet_address TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            registration_date DATE
        )
    ''')

    # Table: Medical Records (The actual data, linked to patient)
    c.execute('''
        CREATE TABLE medical_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_wallet TEXT NOT NULL,
            record_type TEXT NOT NULL,
            description TEXT NOT NULL,
            doctor_wallet TEXT,
            date_created DATETIME,
            file_link TEXT,  -- <--- NEW COLUMN
            FOREIGN KEY(patient_wallet) REFERENCES patients(wallet_address)
        )
    ''')

    print("✅ Schema Created.")

    # 3. INSERT PATIENTS
    print("👤 Registering Patients...")
    for p in PATIENTS:
        reg_date = datetime.now() - timedelta(days=random.randint(100, 1000))
        # FIX: Convert date to string explicitly for Python 3.12+
        reg_date_str = reg_date.strftime("%Y-%m-%d")
        
        c.execute('INSERT INTO patients (wallet_address, full_name, age, gender, registration_date) VALUES (?, ?, ?, ?, ?)',
                  (p['addr'], p['name'], p['age'], p['gender'], reg_date_str))

    # 4. INSERT MOCK RECORDS
    print("📄 Generating Medical History with PDFs...")
    
    # Assign specific PDFs to specific patients
    # Aarav (Patient 1) gets the Blood Test PDF
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    c.execute('''INSERT INTO medical_records (patient_wallet, record_type, description, doctor_wallet, date_created, file_link)
                 VALUES (?, ?, ?, ?, ?, ?)''', 
                 (os.getenv("GANACHE_ACCOUNT_1_ADDR"), "Blood Test", "Hemoglobin 13.5", DOCTOR, now_str, "secure_reports/Blood_Test_Report.pdf"))

    # Priya (Patient 2) gets the MRI PDF
    c.execute('''INSERT INTO medical_records (patient_wallet, record_type, description, doctor_wallet, date_created, file_link)
                 VALUES (?, ?, ?, ?, ?, ?)''', 
                 (os.getenv("GANACHE_ACCOUNT_2_ADDR"), "MRI Scan", "Brain Scan Normal", DOCTOR, now_str, "secure_reports/MRI_Scan_Report.pdf"))

    # Rohan (Patient 3) gets Discharge Summary
    c.execute('''INSERT INTO medical_records (patient_wallet, record_type, description, doctor_wallet, date_created, file_link)
                 VALUES (?, ?, ?, ?, ?, ?)''', 
                 (os.getenv("GANACHE_ACCOUNT_3_ADDR"), "Discharge Summary", "Dengue Fever Recovery", DOCTOR, now_str, "secure_reports/Discharge_Summary.pdf"))

    # Add random text-only records for others
    for p in PATIENTS:
        num_records = random.randint(2, 4)
        for _ in range(num_records):
            rec = random.choice(RECORD_TYPES)
            rec_date = datetime.now() - timedelta(days=random.randint(1, 365))
            
            # FIX: Convert datetime to string explicitly
            rec_date_str = rec_date.strftime("%Y-%m-%d %H:%M:%S")
            
            c.execute('''INSERT INTO medical_records (patient_wallet, record_type, description, doctor_wallet, date_created, file_link)
                         VALUES (?, ?, ?, ?, ?, ?)''', 
                         (p['addr'], rec[0], rec[1], DOCTOR, rec_date_str, None))

    conn.commit()
    conn.close()
    print(f"🎉 Success! Database 'hospital.db' created with {len(PATIENTS)} patients and random records.")

if __name__ == "__main__":
    setup_database()