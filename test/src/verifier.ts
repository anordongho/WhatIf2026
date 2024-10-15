import { generateSignerVerifierUtil, encryptUtil, decryptUtil, generateSymmetricKeyAndIv, encryptDataWithAES, decryptDataWithAES, decryptSymmetricKeyWithRSA, encryptSymmetricKeyWithRSA } from "./crypto-utils";
import { sign, verify } from 'crypto';
import { SDJwtVcInstance } from '@sd-jwt/sd-jwt-vc';
import { generateSalt, digest } from '@sd-jwt/crypto-nodejs';

const requiredClaimKeys = ['birth_date'];

const issuerKeyPair = {
    privateKey: "-----BEGIN PRIVATE KEY-----\nthisisadummyprivatekey\n-----END PRIVATE KEY-----\n",
    publicKey: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0MY+oiDyL75FjhwkhT9D\nbdBy8ICMCxTbi3KcpEZweb59ahodD61+/GGVtlMH3hMu8Z19nss/vP8kZijv5PjY\nmbHqVR+LEA5UE5asnW4EMOpnWh17ZLa0X2fJ7tK+HZtyRdWLZbqLwsioxjhguN9L\nHD4cMqsxzK8oC+ibQlC7wKoDQ+lyBQOQsW2l4dTLO87+n68D4gg4PlSy8gq0cGmG\n/V7m/TcHf15bcda19QftA7+AtY76w4NcNHV4PzfQv/lg586E8nI5BvmJzGPASdjZ\nW9G8o42k4xNczVvLWXLoIgPMyw3aqEUeVpF5NMT43JMeumNiU5G1QNfYMu1yKpnx\nnwIDAQAB\n-----END PUBLIC KEY-----\n"
};

const signer = (data: string): string => {
    const signature = sign('sha256', Buffer.from(data), issuerKeyPair.privateKey);
    return signature.toString('base64url');
};

const verifier = (data: string, signature: string): boolean => {
    return verify('sha256', Buffer.from(data), issuerKeyPair.publicKey, Buffer.from(signature, 'base64url'));
};

export class VCVerifier {
    private verifierKeyPair: any;
    private sdJwt = new SDJwtVcInstance({
        signer,
        verifier,
        signAlg: 'RS256', // Using RS256 for RSA signature algorithm
        hasher: digest,   // Assuming digest function is already defined
        hashAlg: 'SHA-256',
        saltGenerator: generateSalt, // Assuming saltGenerator is defined
    });

    constructor(verifierKeyPair: any) {
        this.verifierKeyPair = verifierKeyPair;
    }

    // get holder's public key from vc_registry using vc_registry_address

    // Decrypt vp with verifier's private key
    decryptVP(encryptedCredentialandIV: any, encryptedSymmetricKey: any) {
        const symmetricKey = decryptSymmetricKeyWithRSA(Buffer.from(encryptedSymmetricKey, 'base64'), this.verifierKeyPair.privateKey);
        const decryptedData = decryptDataWithAES(encryptedCredentialandIV.encryptedData, symmetricKey, Buffer.from(encryptedCredentialandIV.iv, 'base64'));
        // decryptedData is the encoded vp(string)

        // const decodedVP = await decodeSdJwtHolder(decryptedData);
        
        return decryptedData;
    }

    verifyVC(encodedVP: string) {
        return this.sdJwt.verify(encodedVP, requiredClaimKeys);
    }

    // Check signature of holder in vp

    // Find issuer's public key and issue history from vc_registry

    // Verify vc with issuer's public key
}