export type KeyPair = {
    privateKey: string;
    publicKey: string;
};

export type EncryptedDataAndIV = {
    encryptedData: string;
    iv: string;
};

export type AESEncrypted = {
    encryptedDataAndIV: EncryptedDataAndIV;
    encryptedSymmetricKey: Buffer;
};

export type VCEncrypted = AESEncrypted;
export type VPEncrypted = AESEncrypted;

export type VCInfo = {
    name: string;            // Name should be a string
    id: number;              // Unique ID is a number
    unique_id: number;       // Unique ID is a number
    gender: string;          // Gender is a string
    birth_date: Date;         // Birthdate is a Date object
    email: string;           // Email is a string (validated separately)
    address: string;         // Address is a string
    phone_number: string;    // Phone number is a string
    issuance_date: Date;         // Timestamp is a Date object
    vc_registry_address: string;  // Additional server address, a string
    citizenship: string;
};

export type VPInfo = {
    sdjwt: string;
    holder_signature: Buffer;
};

export function parseToVCInfo(userInput: {
    name: string;
    id: string;          // ID might come as a string from user input
    unique_id: string;   // Unique ID might come as a string from user input
    gender: string;
    birth_date: string;   // Birthdate might come as a string from user input
    email: string;
    address: string;
    phone_number: string;
    citizenship: string;
}, vc_registry_address: string): VCInfo {
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
        vc_registry_address: vc_registry_address,
        citizenship: userInput.citizenship
    };
};