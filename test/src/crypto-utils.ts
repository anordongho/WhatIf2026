import { generateKeyPairSync, publicEncrypt, privateDecrypt, sign, verify } from 'crypto';

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
