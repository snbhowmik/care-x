import streamlit as st
import pandas as pd
import time
import sqlite3
from web3 import Web3
import os
import json

# --- ⚙️ CONFIGURATION ---
from dotenv import load_dotenv
load_dotenv()

# --- ⚙️ CONFIGURATION ---
BLOCKCHAIN_URL = os.getenv("BLOCKCHAIN_URL", "http://127.0.0.1:7545")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
# Path to the shared SQLite DB created by the Backend
DB_PATH = os.path.join(os.getcwd(), "emr_platform/backend/emr_data.db")
# ------------------------

# 1. Setup Web3 Connection
@st.cache_resource
def get_web3():
    return Web3(Web3.HTTPProvider(BLOCKCHAIN_URL))

w3 = get_web3()

def get_contract():
    if not w3.is_connected():
        st.error("❌ Blockchain Unreachable! Is Ganache running?")
        return None
    
    # ABI must match the deployed HealthRecord contract
    # We only need the read functions and events usually, but here is the full view needed
    abi = [
        {"inputs":[{"internalType":"address","name":"_patient","type":"address"}],"name":"getRecords","outputs":[{"components":[{"internalType":"string","name":"ipfsHash","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bool","name":"isCritical","type":"bool"},{"internalType":"address","name":"deviceId","type":"address"}],"internalType":"struct HealthRecord.Record[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
        {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
    ]
    return w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

contract = get_contract()

# Helper: Get Patient by Wallet
def get_patient_by_wallet(wallet_address):
    if not os.path.exists(DB_PATH):
        st.error(f"DB not found at {DB_PATH}")
        return None
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT id, name, age FROM patients WHERE wallet_address=?", (wallet_address,))
        result = c.fetchone()
        conn.close()
        if result:
            return {"id": result[0], "name": result[1], "age": result[2]}
    except Exception as e:
        st.error(f"DB Read Error (Patient): {e}")
    return None

# Helper: Get Latest Vitals
def get_latest_vitals(patient_id, limit=50):
    if not os.path.exists(DB_PATH):
        return pd.DataFrame()
    try:
        conn = sqlite3.connect(DB_PATH)
        df = pd.read_sql_query(f"SELECT bpm, spo2, timestamp FROM vitals_records WHERE patient_id=? ORDER BY timestamp DESC LIMIT {limit}", conn, params=(patient_id,))
        conn.close()
        return df.sort_values(by="timestamp") # Sort Time Ascending for Chart
    except Exception as e:
        st.error(f"DB Read Error (Vitals): {e}")
        return pd.DataFrame()

# --- UI LAYOUT ---
st.set_page_config(page_title="C.A.R.E. Provider Console", page_icon="🩺", layout="wide")

# Sidebar
st.sidebar.title("🩺 Provider Console")
st.sidebar.markdown("---")

# Identity
st.sidebar.subheader("👤 Doctor Identity")
doctor_address = st.sidebar.text_input("Wallet Address", value=os.getenv("GANACHE_ACCOUNT_2_ADDR"))

st.sidebar.markdown("---")
st.sidebar.subheader("🏥 Patient Search")
patient_address = st.sidebar.text_input("Patient Wallet", value=os.getenv("GANACHE_ACCOUNT_3_ADDR")) # Default to demo patient

auto_refresh = st.sidebar.checkbox("🔴 Live Vitals Feed", value=True)

# Main Dashboard
st.title("🏥 Central EMR Dashboard")

if not w3.is_connected():
    st.error("⚠️ Blockchain Connection Failed. Check Ganache.")
    st.stop()

if patient_address:
    # 1. Resolve Identity
    patient = get_patient_by_wallet(patient_address)
    
    col_info, col_status = st.columns([3, 1])
    with col_info:
        if patient:
            st.markdown(f"### 📇 Patient: **{patient['name']}** (ID: {patient['id']}, Age: {patient['age']})")
        else:
            st.warning(f"Patient Identity Unknown in Local DB ({patient_address})")

    st.markdown("---")

    # 2. Vitals Monitor (Real-Time from Gateway -> DB)
    st.subheader("📈 Real-Time Critical Vitals")
    
    if patient:
        vitals_df = get_latest_vitals(patient['id'])
        
        if not vitals_df.empty:
            # Create metrics
            latest = vitals_df.iloc[-1]
            m1, m2, m3 = st.columns(3)
            m1.metric("Heart Rate", f"{int(latest['bpm'])} BPM", delta=f"{int(latest['bpm'] - 80)} vs Avg", delta_color="inverse")
            m2.metric("SpO2", f"{int(latest['spo2'])}%", delta="Normal" if latest['spo2'] > 95 else "Low")
            m3.metric("Last Sync", "Just Now")

            # Charts
            chart_data = vitals_df.set_index("timestamp")[["bpm", "spo2"]]
            st.line_chart(chart_data, height=250)
        else:
             st.info("Waiting for telemetry data from Gateway...")

    st.markdown("---")

    # 3. Blockchain Records (Secure View)
    st.subheader("🔒 Blockchain Medical Records")
    
    if contract and Web3.is_address(doctor_address) and Web3.is_address(patient_address):
        try:
             # CALL (View) - Will fail if no access
             records = contract.functions.getRecords(patient_address).call({'from': doctor_address})
             
             if not records:
                 st.info("No records found on-chain.")
             else:
                 # Convert to DataFrame for nicer display
                 rec_data = []
                 for r in records:
                     # r struct: ipfsHash, timestamp, isCritical, deviceId
                     rec_data.append({
                         "Date": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(r[1])),
                         "Type": "🚨 CRITICAL" if r[2] else "📝 Routine",
                         "IPFS Verify": r[0],
                         "Source": r[3]
                     })
                 st.dataframe(pd.DataFrame(rec_data), width='stretch')
                 st.success(f"✅ Verified {len(records)} records from Ethereum Ledger.")

        except Exception as e:
            st.error("⛔ **ACCESS DENIED**")
            st.error(f"The Smart Contract rejected your view request. You ({doctor_address[:6]}...) do not have permission for this patient.")

# Auto Refresh Logic
if auto_refresh:
    time.sleep(2)
    st.rerun()