import json
import os
from solcx import compile_standard, install_solc

# Ensure specific version is installed
print("🔧 Installing/Verifying Solidity Compiler 0.8.19...")
install_solc('0.8.19')

# Load Contract Source
contract_path = os.path.join(os.path.dirname(__file__), "HealthContract.sol")
with open(contract_path, "r") as f:
    health_record_source = f.read()

# Compile
print("⚙️ Compiling HealthContract.sol...")
compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"HealthContract.sol": {"content": health_record_source}},
        "settings": {
            "outputSelection": {
                "*": {
                    "*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]
                }
            }
        },
    },
    solc_version="0.8.19",
)

# Extract ABI and Bytecode
bytecode = compiled_sol["contracts"]["HealthContract.sol"]["HealthRecord"]["evm"]["bytecode"]["object"]
abi = compiled_sol["contracts"]["HealthContract.sol"]["HealthRecord"]["abi"]

# Save to artifacts
artifacts_dir = os.path.join(os.path.dirname(__file__), "artifacts")
if not os.path.exists(artifacts_dir):
    os.makedirs(artifacts_dir)

artifact_path = os.path.join(artifacts_dir, "HealthRecord.json")
with open(artifact_path, "w") as f:
    json.dump({"abi": abi, "bytecode": bytecode}, f, indent=4)

print(f"✅ Compilation Successful! Artifacts saved to {artifact_path}")
