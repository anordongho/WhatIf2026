// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SingleIssuerVerifiableDataRegistry {
    address public immutable issuer;

    struct VCRecord {
        address holderPublicKey;
        uint256 issuanceDate;
        uint256 expirationDate;
        bytes32 vcSchemeHash;
    }

    // Mapping from VC ID to VCRecord
    mapping(bytes32 => VCRecord) private vcRecords;
    
    event VCRegistered(
        bytes32 indexed vcId,
        address indexed holderPublicKey,
        uint256 issuanceDate,
        uint256 expirationDate
    );

    modifier onlyIssuer() {
        require(msg.sender == issuer, "Only issuer can call this function");
        _;
    }

    constructor() {
        issuer = msg.sender;
    }

    function registerVC(
        bytes32 vcId,
        address holderPublicKey,
        uint256 expirationDate,
        bytes32 vcSchemeHash
    ) public onlyIssuer {
        uint256 currentTime = block.timestamp - 946684800; // Seconds since 2000-01-01

        require(expirationDate > currentTime, "Expiration date must be in the future");

        vcRecords[vcId] = VCRecord({
            holderPublicKey: holderPublicKey,
            issuanceDate: currentTime,
            expirationDate: expirationDate,
            vcSchemeHash: vcSchemeHash
        });

        emit VCRegistered(
            vcId,
            holderPublicKey,
            currentTime,
            expirationDate
        );
    }

    function updateVC(
        bytes32 vcId,
        uint256 newExpirationDate,
        bytes32 newVcSchemeHash
    ) public onlyIssuer {
        require(vcRecords[vcId].issuanceDate != 0, "VC does not exist");
        uint256 currentTime = block.timestamp - 946684800;
        require(newExpirationDate > currentTime, "New expiration date must be in the future");

        vcRecords[vcId].expirationDate = newExpirationDate;
        vcRecords[vcId].vcSchemeHash = newVcSchemeHash;

        emit VCRegistered(
            vcId,
            vcRecords[vcId].holderPublicKey,
            vcRecords[vcId].issuanceDate,
            newExpirationDate
        );
    }

    function getVCAttributes(bytes32 vcId) public view returns (
        address holderPublicKey,
        uint256 issuanceDate,
        uint256 expirationDate,
        bytes32 vcSchemeHash
    ) {
        VCRecord memory record = vcRecords[vcId];
        require(record.issuanceDate != 0, "VC does not exist");
        
        return (
            record.holderPublicKey,
            record.issuanceDate,
            record.expirationDate,
            record.vcSchemeHash
        );
    }

    function isVCValid(bytes32 vcId) public view returns (bool) {
        VCRecord memory record = vcRecords[vcId];
        if (record.issuanceDate == 0) return false;
        
        uint256 currentTime = block.timestamp - 946684800;
        return currentTime <= record.expirationDate;
    }
}