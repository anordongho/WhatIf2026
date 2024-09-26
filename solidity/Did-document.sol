// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DIDRegistry {
    mapping(address => mapping(bytes32 => bytes)) public attributes;
    mapping(address => uint256) public changed;
    mapping(address => address) public owners;

    event DIDAttributeChanged(
        address indexed identity,
        bytes32 indexed name,
        bytes value,
        uint256 validTo,
        uint256 previousChange
    );

    event DIDOwnerChanged(
        address indexed identity,
        address owner,
        uint256 previousChange
    );

    modifier onlyOwner(address identity) {
        require(msg.sender == identity || owners[identity] == msg.sender, "Not authorized");
        _;
    }

    function setAttribute(
        address identity,
        bytes32 name,
        bytes memory value,
        uint256 validity
    ) public onlyOwner(identity) {
        attributes[identity][name] = value;
        emit DIDAttributeChanged(
            identity,
            name,
            value,
            block.timestamp + validity,
            changed[identity]
        );
        changed[identity] = block.timestamp;
    }

    function changeOwner(address identity, address newOwner) public onlyOwner(identity) {
        owners[identity] = newOwner;
        emit DIDOwnerChanged(identity, newOwner, changed[identity]);
        changed[identity] = block.timestamp;
    }

    function getAttribute(address identity, bytes32 name) public view returns (bytes memory) {
        return attributes[identity][name];
    }

    function identityOwner(address identity) public view returns (address) {
        address owner = owners[identity];
        if (owner != address(0)) {
            return owner;
        }
        return identity;
    }
}