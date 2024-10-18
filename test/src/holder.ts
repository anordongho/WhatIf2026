import { decodeSdJwt, getClaims } from '@sd-jwt/decode';
import { digest, generateSalt } from '@sd-jwt/crypto-nodejs';
import { SDJwtVcInstance } from '@sd-jwt/sd-jwt-vc';
import { decryptDataWithAES, decryptSymmetricKeyWithRSA, encryptUtil, generateSignerVerifierUtil } from './crypto-utils';
import { KeyPair, VCEncrypted } from './myType';
// import {
//     type PresentationFrame,
//     type SDJWTCompact,
//   } from '@sd-jwt/types';

// TODO: get issuer's public key from the webpage.
const issuerPublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0MY+oiDyL75FjhwkhT9D\nbdBy8ICMCxTbi3KcpEZweb59ahodD61+/GGVtlMH3hMu8Z19nss/vP8kZijv5PjY\nmbHqVR+LEA5UE5asnW4EMOpnWh17ZLa0X2fJ7tK+HZtyRdWLZbqLwsioxjhguN9L\nHD4cMqsxzK8oC+ibQlC7wKoDQ+lyBQOQsW2l4dTLO87+n68D4gg4PlSy8gq0cGmG\n/V7m/TcHf15bcda19QftA7+AtY76w4NcNHV4PzfQv/lg586E8nI5BvmJzGPASdjZ\nW9G8o42k4xNczVvLWXLoIgPMyw3aqEUeVpF5NMT43JMeumNiU5G1QNfYMu1yKpnx\nnwIDAQAB\n-----END PUBLIC KEY-----\n";

export class Holder {
    private holderKeyPair: KeyPair;
    private sdJwtVcInstance: SDJwtVcInstance;

    constructor(holderKeyPair: KeyPair) {
        this.holderKeyPair = holderKeyPair;
        const { signer, verifier } = generateSignerVerifierUtil(holderKeyPair.privateKey, holderKeyPair.publicKey);
        this.sdJwtVcInstance = new SDJwtVcInstance({
            signer,
            verifier,
            signAlg: 'RS256', // Using RS256 for RSA signature algorithm
            hasher: digest,   // Assuming digest function is already defined
            hashAlg: 'SHA-256',
            saltGenerator: generateSalt, // Assuming saltGenerator is defined
        });
    }

    // receive VC from issuer
    public receiveVC(sdjwt: any) {

    }
    
    // Decode the SD-JWT using the provided digest
    async decodeVC(sdJwt: string) {
        try {
            console.log("Starting decoding...")
            // console.log(sdJwt);
    
            const decodedSdJwt = await decodeSdJwt(sdJwt, digest);
    
            // Log the decoded disclosures
            console.log('The decoded Disclosures are:');
            console.log(JSON.stringify(decodedSdJwt.disclosures, null, 2));
    
    
            const claims = await getClaims(
                decodedSdJwt.jwt.payload,
                decodedSdJwt.disclosures,
                digest,
            );
    
            console.log('The claims are:'); // the full vc
            console.log(JSON.stringify(claims, null, 2));
    
            return decodedSdJwt;
        } catch (error) {
            console.error('Error decoding SD-JWT:', error);
        }
    }

    public encryptFormContents(formContents: any) {
        // Encrypt the form contents using the issuer's public key to send to the issuer
        const encryptedFormContents = encryptUtil(formContents, issuerPublicKey);
        return encryptedFormContents;
    }

    // Decrypt the credential (encrypted by issuer) using the holder's private key
    public decryptCredential(encryptedVC: VCEncrypted) {
        const symmetricKey = decryptSymmetricKeyWithRSA(Buffer.from(encryptedVC.encryptedSymmetricKey), this.holderKeyPair.privateKey);
        const decryptedData = decryptDataWithAES(encryptedVC.encryptedCredentialandIV.encryptedData, symmetricKey, Buffer.from(encryptedVC.encryptedCredentialandIV.iv, 'base64'));
        return decryptedData;
    }
}