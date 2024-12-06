import { decodeSdJwt, getClaims } from '@sd-jwt/decode';
import { digest, generateSalt } from '@sd-jwt/crypto-nodejs';
import { SDJwtVcInstance } from '@sd-jwt/sd-jwt-vc';

import { sign, verify } from 'crypto';

import { decryptUtilAES, encryptUtilAES, generateSignerVerifierUtil } from './crypto-utils';
import { KeyPair, VCEncrypted, VPEncrypted, VPInfo } from './myType';
import fs from 'fs';
import path from 'path';

// import {
//     type PresentationFrame,
//     type SDJWTCompact,
//   } from '@sd-jwt/types';

// TODO: get issuer's public key from the webpage.
const issuerPublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0MY+oiDyL75FjhwkhT9D\nbdBy8ICMCxTbi3KcpEZweb59ahodD61+/GGVtlMH3hMu8Z19nss/vP8kZijv5PjY\nmbHqVR+LEA5UE5asnW4EMOpnWh17ZLa0X2fJ7tK+HZtyRdWLZbqLwsioxjhguN9L\nHD4cMqsxzK8oC+ibQlC7wKoDQ+lyBQOQsW2l4dTLO87+n68D4gg4PlSy8gq0cGmG\n/V7m/TcHf15bcda19QftA7+AtY76w4NcNHV4PzfQv/lg586E8nI5BvmJzGPASdjZ\nW9G8o42k4xNczVvLWXLoIgPMyw3aqEUeVpF5NMT43JMeumNiU5G1QNfYMu1yKpnx\nnwIDAQAB\n-----END PUBLIC KEY-----\n";
const verifierPublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvUjlPzpLDdnqVrdZYnA6\nKdlum7PzCS1ShxYdBtVMSbcIDFyLXpg2bk7juC/7S7Cy2XC0BzUdHMmHAjqldV8S\n+A9T71/pk7fd8ucWEiBlskd3LlbvGisSDQrnYObuzWtvpPTvODLVOqXgIMFvCu6u\n1rgk4ceb4D4VELa9DRrPfZlDWT6j+IbV82rg8j+8fy8GJh0rx8v6hx1gUPHKVODI\nFoeP5+IpdRX0AvjAEPAWdNLLLdVv5ssgV/zI1gGqFcfnNOc5Jx1YnowhPoiECoqr\nLO0cwuXSRQBWC7KpA7QhAHpA6r5a4BO8E2cG8I2C3AEgFUrRhO9cL6O0R0ZO1fml\nWQIDAQAB\n-----END PUBLIC KEY-----\n"



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

    // Decode the SD-JWT using the provided digest
    async decodeVC(sdJwt: string) {
        try {

            const decodedSdJwt = await decodeSdJwt(sdJwt, digest);

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

    // make the VP based on selected options
    async makeVP(credential: string, presentationFrame: Record<string, boolean>): Promise<VPInfo> {

        // encoded sdjwt after presentation
        const presentation = await this.sdJwtVcInstance.present(credential, presentationFrame);

        console.log("presentation in makevp", presentation);

        const holderSignature = sign(null, Buffer.from(presentation), this.holderKeyPair.privateKey);

        const verifyResult = verify(null, Buffer.from(presentation), this.holderKeyPair.publicKey, holderSignature);

        console.log("holder's signature", holderSignature);
        console.log("verify result: ", verifyResult);

        // Return the VPInfo object
        return {
            sdjwt: presentation,
            holder_signature: holderSignature // Signature proving holder's action
        };
    }

    public encryptFormContents(formContents: any) {
        // Encrypt the form contents using the issuer's public key to send to the issuer
        const encryptedFormContents = encryptUtilAES(JSON.stringify(formContents), issuerPublicKey);
        return encryptedFormContents;
    }

    public encryptVP(vpString: any): VPEncrypted {
        return encryptUtilAES(vpString, verifierPublicKey);
    }

    // Decrypt the credential (encrypted by issuer) using the holder's private key
    public decryptVC(encryptedVC: VCEncrypted) {
        return decryptUtilAES(encryptedVC, this.holderKeyPair.privateKey);
    }

    async encryptVoteHomomorphic(vote: number): Promise<string> {
        const SEAL = require('node-seal')
        const seal = await SEAL();
        const schemeType = seal.SchemeType.bfv
        const securityLevel = seal.SecurityLevel.tc128
        const polyModulusDegree = 4096
        const bitSizes = [36, 36, 37]
        const bitSize = 20

        const parms = seal.EncryptionParameters(schemeType)

        parms.setPolyModulusDegree(polyModulusDegree)

        parms.setCoeffModulus(
            seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
        )

        parms.setPlainModulus(
            seal.PlainModulus.Batching(polyModulusDegree, bitSize)
        )

        const context = seal.Context(parms, true, securityLevel);
        if (!context.parametersSet()) {
            throw new Error('Encryption parameters are not set properly.');
        }

        // Load the public key
        const publicKeySerialized = fs.readFileSync('publicKey.txt', 'utf8');
        const publicKey = seal.PublicKey();
        publicKey.load(context, publicKeySerialized);


        const encryptor = seal.Encryptor(context, publicKey);
        const encoder = seal.BatchEncoder(context);

        const voteArray = new Int32Array([vote]);
        const plainText = encoder.encode(voteArray);
        const encryptedVote = seal.CipherText();
        encryptor.encrypt(plainText, encryptedVote);

        // Serialize the CipherText using the `save()` method
        const serializedCipherText = encryptedVote.save();
        // console.log("The encrypted vote (serialized):", serializedCipherText);

        // Save the serialized encrypted vote to a file
        // 이거 test/dist에 파일을 저장하는듯
        const votesFilePath = path.join(__dirname, 'encryptedVotes.txt');
        fs.appendFileSync(votesFilePath, serializedCipherText + '\n');

        return "success"
        // return serializedCipherText;  // Returning the serialized ciphertext as a string
    }
}