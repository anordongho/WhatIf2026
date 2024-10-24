import { generateKeyPairSync, publicEncrypt, privateDecrypt, sign, verify, constants, createCipheriv, randomBytes, createDecipheriv } from 'crypto';
import { AESEncrypted } from './myType';

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

export function encryptUtilAES(data: string, publicKey: string): AESEncrypted {
    const { aesKey, iv } = generateSymmetricKeyAndIv();
    const encryptedDataAndIV = encryptDataWithAES(data, aesKey, iv);
    const encryptedSymmetricKey = encryptSymmetricKeyWithRSA(aesKey, publicKey);
    return { encryptedDataAndIV, encryptedSymmetricKey };
}

export function decryptUtilAES(encryptedData: AESEncrypted, privateKey: string): string{
    const symmetricKey = decryptSymmetricKeyWithRSA(Buffer.from(encryptedData.encryptedSymmetricKey), privateKey);
    const decryptedData = decryptDataWithAES(encryptedData.encryptedDataAndIV.encryptedData, symmetricKey, Buffer.from(encryptedData.encryptedDataAndIV.iv, 'base64'));
    return decryptedData;
}

/**
 * Generate a pair of symmetric key and IV
 * @returns The symmetric key and IV generated.
 */
function generateSymmetricKeyAndIv() {
    const aesKey = randomBytes(32); // AES-256 key size
    const iv = randomBytes(16); // Initialization vector for AES
    return { aesKey, iv };
}

/**
 * Encrypt data with AES-256-CBC.
 * @param data - The plaintext data to encrypt.
 * @param symmetricKey - The symmetric key for AES encryption (32 bytes).
 * @param iv - The initialization vector (16 bytes).
 * @returns The encrypted data and IV used.
 */
const encryptDataWithAES = (data: string, symmetricKey: Buffer, iv: Buffer) => {
    const cipher = createCipheriv('aes-256-cbc', symmetricKey, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return { encryptedData: encrypted, iv: iv.toString('base64') };
};

/**
 * Decrypt data encrypted with AES-256-CBC.
 * @param encryptedData - The encrypted data to decrypt.
 * @param key - The symmetric key for AES decryption (32 bytes).
 * @param iv - The initialization vector (16 bytes).
 * @returns The decrypted plaintext data.
 */
const decryptDataWithAES = (encryptedData: string, key: Buffer, iv: Buffer) => {
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

/**
 * Encrypt a symmetric key with RSA.
 * @param key - The symmetric key to encrypt.
 * @param publicKey - The RSA public key for encryption.
 * @returns The encrypted symmetric key.
 */
const encryptSymmetricKeyWithRSA = (key: Buffer, publicKey: string) => {
    return publicEncrypt({
        key: publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
    }, key);
};

/**
 * Decrypt a symmetric key with RSA.
 * @param encryptedKey - The encrypted symmetric key.
 * @param privateKey - The RSA private key for decryption.
 * @returns The decrypted symmetric key.
 */
const decryptSymmetricKeyWithRSA = (encryptedKey: Buffer, privateKey: string) => {
    return privateDecrypt({
        key: privateKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
    }, encryptedKey);
};