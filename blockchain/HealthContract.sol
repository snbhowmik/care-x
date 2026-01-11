// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthRecord {
    
    struct Record {
        string ipfsHash;
        uint256 timestamp;
        bool isCritical;
        address deviceId;
    }

    // Storage
    mapping(address => Record[]) public patientRecords;
    // Access Control: Patient Address -> Device Address -> Is Authorized to WRITE?
    mapping(address => mapping(address => bool)) public authorizedDevices;
    
    // Data Sharing: Patient Address -> Doctor/Viewer Address -> Is Authorized to VIEW?
    mapping(address => mapping(address => bool)) public dataAccessList;

    event RecordAdded(address indexed patient, string ipfsHash, bool isCritical, uint256 timestamp);
    event AccessGranted(address indexed patient, address indexed device);
    event AccessRevoked(address indexed patient, address indexed device);
    event DataShared(address indexed patient, address indexed doctor);
    event DataUnshared(address indexed patient, address indexed doctor);

    // Modifier: Only the patient themselves OR an authorized device can write
    modifier onlyAuthorized(address _patient) {
        require(
            msg.sender == _patient || authorizedDevices[_patient][msg.sender],
            "Not authorized to add records for this patient"
        );
        _;
    }

    // 1. Authorize a Gateway/Doctor to write to my records
    function authorizeDevice(address _device) public {
        authorizedDevices[msg.sender][_device] = true;
        emit AccessGranted(msg.sender, _device);
    }

    // 2. Revoke access (Write)
    function revokeDevice(address _device) public {
        authorizedDevices[msg.sender][_device] = false;
        emit AccessRevoked(msg.sender, _device);
    }

    // --- NEW: DATA SHARING (VIEW PERMISSIONS) ---
    
    // 3. Share Data (Grant View Access)
    function grantDataAccess(address _doctor) public {
        dataAccessList[msg.sender][_doctor] = true;
        emit DataShared(msg.sender, _doctor);
    }

    // 4. Revoke Data Share
    function revokeDataAccess(address _doctor) public {
        dataAccessList[msg.sender][_doctor] = false;
        emit DataUnshared(msg.sender, _doctor);
    }

    // 5. Add Record (Protected Write)
    function addRecord(address _patient, string memory _ipfsHash, bool _isCritical) public onlyAuthorized(_patient) {
        Record memory newRecord = Record({
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            isCritical: _isCritical,
            deviceId: msg.sender
        });

        patientRecords[_patient].push(newRecord);
        emit RecordAdded(_patient, _ipfsHash, _isCritical, block.timestamp);
    }

    // 6. Secure Fetch (Protected View)
    // Only the Patient OR an Authorized Doctor can view the records
    function getRecords(address _patient) public view returns (Record[] memory) {
        require(
            msg.sender == _patient || dataAccessList[_patient][msg.sender],
            "Access Denied: You do not have permission to view this patient's records."
        );
        return patientRecords[_patient];
    }
}