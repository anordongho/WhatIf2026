import { generateKeyPairSync, publicEncrypt, privateDecrypt, sign, verify, constants } from 'crypto';

// Step 1: Generate RSA Key Pairs for Issuer, Holder, Verifier
export function generateKeyPairUtil() {
    return generateKeyPairSync('rsa', {
        modulusLength: 2048, // Key size
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
}

// Generating signer, verifier for a given key pair (private key of signer, public key of verifier)
export function generateSignerVerifierUtil(privateKey: string, publicKey: string) {
    const signer = (data: string): string => {
        const signature = sign('sha256', Buffer.from(data), privateKey);
        return signature.toString('base64url');
    };

    const verifier = (data: string, signature: string): boolean => {
        return verify('sha256', Buffer.from(data), publicKey, Buffer.from(signature, 'base64url'));
    };

    return { signer, verifier };
}

// Get the raw input data(any type), then encrypt it using public key to base64 string
export function encryptUtil(dataToBeEncrypted: any, publicKey: string) {

    // Convert the data (plaintext) into a buffer
    const dataBuffer = Buffer.from(JSON.stringify(dataToBeEncrypted));

    // Encrypt the form data using the issuer's public key
    const encryptedData = publicEncrypt(
        {
            key: publicKey,
            padding: constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        dataBuffer
    );

    // Convert encrypted data to a Base64 string for transmission
    const encryptedDataBase64 = encryptedData.toString('base64');

    return encryptedDataBase64;
}

// get the encrypted data(in base64 string) and decrypt it (to decrypted object)
export function decryptUtil(dataToBeDecrypted: string, privateKey: string) {

    const encryptedBuffer = Buffer.from(dataToBeDecrypted, 'base64');

    // Decrypt the payload using the issuer's private key
    const payload = privateDecrypt(
        {
            key: privateKey,
            padding: constants.RSA_PKCS1_OAEP_PADDING, // Use OAEP padding
            oaepHash: 'sha256', // Recommended hash algorithm for OAEP
        },
        encryptedBuffer
    );

    console.log(payload);

    const parsedPayload = JSON.parse(payload.toString());
    return parsedPayload;
}
