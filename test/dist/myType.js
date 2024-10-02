"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToVCInfo = parseToVCInfo;
function parseToVCInfo(userInput, vc_registry_address) {
    // Get the current timestamp as a Date object
    const issuance_date = new Date();
    // Parse birthdate string into a Date object
    const birthdate = new Date(userInput.birth_date);
    // Parse id and unique_id to numbers
    const id = Number(userInput.id);
    const unique_id = Number(userInput.unique_id);
    // Return the object in the VCInfo structure
    return {
        name: userInput.name,
        id: id,
        unique_id: unique_id,
        gender: userInput.gender,
        birth_date: birthdate,
        email: userInput.email,
        address: userInput.address,
        phone_number: userInput.phone_number,
        issuance_date: issuance_date,
        vc_registry_address: vc_registry_address
    };
}
