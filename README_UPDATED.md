# Care-X Project

This project contains a blockchain-based EMR platform, a patient dashboard, and other components.

## Security Update

This project has been updated to remove hardcoded private keys and other sensitive information from the source code. It now uses environment variables to manage configuration.

### How to set up the environment

1.  **Create a `.env` file:**

    In the root directory of the project, create a file named `.env`. You can do this by copying the example file:

    ```bash
    cp .env.example .env
    ```

2.  **Edit the `.env` file:**

    Open the `.env` file in a text editor and add the following values:

    *   `GANACHE_URL`: The URL of your Ganache instance. The default is `http://127.0.0.1:7545`.
    *   `DEPLOYER_PRIVATE_KEY`: The private key of the account you want to use to deploy the smart contract. You can get this from your Ganache instance.
    *   `HOSPITAL_PRIVATE_KEY`: The private key of the account that will be used to pay for gas fees when adding records to the blockchain. You can use the same private key as the deployer.
    *   `FALLBACK_CONTRACT_ADDRESS`: (Optional) A fallback address for the smart contract if the `emr_platform/backend/contract_config.json` file is not found.

### Installing Dependencies

Before running the applications, you need to install the dependencies for each component.

*   **Blockchain:**

    ```bash
    pip install -r blockchain/requirements.txt
    ```

*   **EMR Platform Backend:**

    ```bash
    pip install -r emr_platform/backend/requirements.txt
    ```

*   **EMR Platform Frontend:**

    ```bash
    cd emr_platform/frontend
    npm install
    ```

*   **Patient Dashboard App:**

    ```bash
    cd patient-dashboard-app
    npm install
    ```