import json
import os
from web3 import Web3
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- CONFIGURATION ---
GANACHE_URL = os.getenv("GANACHE_URL", "http://127.0.0.1:7545")
# The deployer's private key
PRIVATE_KEY = os.getenv("DEPLOYER_PRIVATE_KEY")
# ---------------------

def deploy():
    if not PRIVATE_KEY:
        print("❌ DEPLOYER_PRIVATE_KEY is not set. Please check your .env file.")
        exit()

    # 1. Connect to Ganache
    w3 = Web3(Web3.HTTPProvider(GANACHE_URL))
    if not w3.is_connected():
        print("❌ Connection Failed. Is Ganache Running?")
        exit()
    print(f"✅ Connected to Ganache: {GANACHE_URL}")

    # 2. Load Artifact
    artifact_path = os.path.join(os.path.dirname(__file__), "artifacts", "HealthRecord.json")
    if not os.path.exists(artifact_path):
        print("❌ Artifact not found. Run 'python blockchain/compile.py' first.")
        exit()
        
    with open(artifact_path, "r") as f:
        artifact = json.load(f)
        
    abi = artifact["abi"]
    bytecode = artifact["bytecode"]

    # 3. Deploy
    print("⏳ Deploying Contract...")
    HealthRecord = w3.eth.contract(abi=abi, bytecode=bytecode)
    account = w3.eth.account.from_key(PRIVATE_KEY)

    # Build Transaction
    construct_txn = HealthRecord.constructor().build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gas': 2000000,
        'gasPrice': w3.to_wei('20', 'gwei')
    })

    # Sign & Send
    signed = w3.eth.account.sign_transaction(construct_txn, private_key=PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    print(f"🎉 Contract Deployed!")
    print(f"📍 Contract Address: {tx_receipt.contractAddress}")
    
    # Save the address for other services to use
    config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "emr_platform", "backend", "contract_config.json")
    with open(config_path, "w") as f:
        json.dump({"address": tx_receipt.contractAddress}, f, indent=4)
    print(f"💾 Saved address to {config_path}")
    
if __name__ == "__main__":
    deploy()