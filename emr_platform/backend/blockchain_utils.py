import json
import os
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- CONFIGURATION ---
GANACHE_URL = os.getenv("GANACHE_URL", "http://127.0.0.1:7545")
HOSPITAL_PRIVATE_KEY = os.getenv("HOSPITAL_PRIVATE_KEY")
FALLBACK_CONTRACT_ADDRESS = os.getenv("FALLBACK_CONTRACT_ADDRESS")

# Deployed Contract Address
# Try to load from shared config first
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "contract_config.json")

def get_contract_address():
    # Priority 1: Env Var
    env_addr = os.getenv("CONTRACT_ADDRESS")
    if env_addr:
        return env_addr
        
    # Priority 2: Config File
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            data = json.load(f)
            return data.get("address")
            
    # Priority 3: Fallback from Env
    return FALLBACK_CONTRACT_ADDRESS

CONTRACT_ADDRESS = get_contract_address()

# Load ABI
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ABI_PATH = os.path.join(BASE_DIR, "abi.json")

def get_web3_provider():
    w3 = Web3(Web3.HTTPProvider(GANACHE_URL))
    if w3.is_connected():
        print(f"✅ Connected to Blockchain at {GANACHE_URL}")
        return w3
    print(f"❌ Could not connect to Blockchain at {GANACHE_URL}")
    return None

w3 = get_web3_provider()

def load_contract():
    if not w3:
        return None
    if not CONTRACT_ADDRESS:
        print("❌ Contract address is not set. Please deploy the contract first or set FALLBACK_CONTRACT_ADDRESS.")
        return None
    with open(ABI_PATH, "r") as f:
        abi = json.load(f)
    return w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

contract = load_contract()

def generate_session_account():
    """
    Generates a brand new, random Ethereum account.
    This acts as the 'Session Identity' for the patient to preserve privacy.
    """
    account = Account.create()
    return account.address, account.key.hex()

def add_record_to_chain(session_address: str, ipfs_hash: str, is_critical: bool):
    """
    Writes the record to the blockchain.
    
    Sender: Hospital (Pays Gas)
    Patient Argument: session_address (The privacy-preserving identity)
    """
    if not w3 or not contract:
        print("⚠️ Blockchain not available. Skipping on-chain write.")
        return None
    
    if not HOSPITAL_PRIVATE_KEY:
        print("❌ HOSPITAL_PRIVATE_KEY is not set. Please check your .env file.")
        return None

    hospital_account = w3.eth.account.from_key(HOSPITAL_PRIVATE_KEY)
    
    # Build Transaction
    # calling addRecord(_patient, _ipfsHash, _isCritical)
    tx = contract.functions.addRecord(
        session_address, 
        ipfs_hash, 
        is_critical
    ).build_transaction({
        'from': hospital_account.address,
        'nonce': w3.eth.get_transaction_count(hospital_account.address),
        'gas': 2000000,
        'gasPrice': w3.to_wei('20', 'gwei')
    })

    # Sign & Send
    signed_tx = w3.eth.account.sign_transaction(tx, HOSPITAL_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    
    print(f"🔗 Transaction Sent! Hash: {tx_hash.hex()}")
    return tx_hash.hex()
