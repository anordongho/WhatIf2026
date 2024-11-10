import { generateSignerVerifierUtil, decryptUtilAES } from "./crypto-utils";
import { sign, verify } from 'crypto';
import { SDJwtVcInstance } from '@sd-jwt/sd-jwt-vc';
import { generateSalt, digest, ES256 } from '@sd-jwt/crypto-nodejs';
import { ethers } from 'ethers';
import { KeyPair, VPEncrypted, VPInfo } from "./myType";
import { getAttribute } from "./did_documents";
import fs from 'fs';
import path from 'path';


const requiredClaimKeys = ['birth_date'];

const issuerKeyPair = {
    privateKey: "-----BEGIN PRIVATE KEY-----\nthisisadummyprivatekey\n-----END PRIVATE KEY-----\n",
    publicKey: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0MY+oiDyL75FjhwkhT9D\nbdBy8ICMCxTbi3KcpEZweb59ahodD61+/GGVtlMH3hMu8Z19nss/vP8kZijv5PjY\nmbHqVR+LEA5UE5asnW4EMOpnWh17ZLa0X2fJ7tK+HZtyRdWLZbqLwsioxjhguN9L\nHD4cMqsxzK8oC+ibQlC7wKoDQ+lyBQOQsW2l4dTLO87+n68D4gg4PlSy8gq0cGmG\n/V7m/TcHf15bcda19QftA7+AtY76w4NcNHV4PzfQv/lg586E8nI5BvmJzGPASdjZ\nW9G8o42k4xNczVvLWXLoIgPMyw3aqEUeVpF5NMT43JMeumNiU5G1QNfYMu1yKpnx\nnwIDAQAB\n-----END PUBLIC KEY-----\n"
};

const holderPublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxr1MtIoqYujusHIG54d9\nhFOIrOdG9B1HL3k8iazIGqU3eXhZNzgfutfwrWglsV+apXbTGDivLmFOZNXvhmc9\nWDmAng5p056qQG9OCDXQ2Vt4NLGHk5kRgR0nJZfjdkXZLrGCoc9q49jLzxeRJDSV\nm7IWlxNdzbZlEG7AJrK8jfZE2K69ARXqukbUubrvuDLj0BCiSRmCuRs7Q0iD5iFz\nToSXzcOO0WOcqtUGQXPjbBMP2hV8gbJZLA+bfdznxAp9vaubJ0mu/NFAPE8VprQa\n5sP5hiS9HFhvtfmJpYaae4fahegt11Bn27RwU1fVKIdvpg4cLaaalEn0aPMERDDS\nyQIDAQAB\n-----END PUBLIC KEY-----\n";

const { signer, verifier } = generateSignerVerifierUtil(issuerKeyPair.privateKey, issuerKeyPair.publicKey);

export class VCVerifier {
    private verifierKeyPair: KeyPair;
    private vcSignVerifier = new SDJwtVcInstance({
        signer,
        verifier,
        signAlg: 'RS256', // Using RS256 for RSA signature algorithm
        hasher: digest,   // Assuming digest function is already defined
        hashAlg: 'SHA-256',
        saltGenerator: generateSalt, // Assuming saltGenerator is defined
    });

    constructor(verifierKeyPair: KeyPair) {
        this.verifierKeyPair = verifierKeyPair;
    }

    // get holder's public key from vc_registry using vc_registry_address
    public getHolderPublicKey(vc_registry_address: string) {
        return getAttribute(vc_registry_address, 'did/pub/Ed25519/veriKey/base64');
    }

    // Decrypt vp with verifier's private key
    public decryptVP(encryptedVP: VPEncrypted): VPInfo {
        const decryptedData = decryptUtilAES(encryptedVP, this.verifierKeyPair.privateKey);
        const decryptedVP = JSON.parse(decryptedData);
        decryptedVP.holder_signature = Buffer.from(decryptedVP.holder_signature, 'base64');
        return decryptedVP
    }

    public async verifyVC(encodedVC: string) {
        return await this.vcSignVerifier.verify(encodedVC, requiredClaimKeys);
    }

    public async verifyVP(vp: VPInfo) {

        // testcode for accessing registry
        // const dummyPublicKey = this.getHolderPublicKey("0x01e708B4e91842a677adDF1Ec5211875f070C5f2");
        // console.log("dummyPublicKey: ", dummyPublicKey);

        const sdjwt = vp.sdjwt;        // encoded SDJwt
        const holderSignature = vp.holder_signature;

        // verify holder's signature
        const verifyResult = verify(null, Buffer.from(sdjwt), holderPublicKey, holderSignature);
        console.log("signature verification result: ", verifyResult)

        // check required claim keys and signature in sdjwt
        const { payload, header, kb } = await this.verifyVC(sdjwt);
        console.log("payload: ", payload);

        const birthDate: Date = payload.birth_date as Date;
        const citizenship: string = payload.citizenship as string;
        const vcRegistryAddress: string = payload.vc_registry_address as string;

        // 유권자 여부 확인
        if (!birthDate) {
            console.log("incorrect date of birth:", birthDate);
            return false
        }

        if (!citizenship) {
            console.log("incorrect citizenship:", citizenship);
            return false
        }

        if (!vcRegistryAddress) {
            console.log("Invalid VC registry address", vcRegistryAddress);
            return false
        }

        if (citizenship !== "Republic of Korea") {
            console.log("not a korean citizen..")
            return false
        }

        if (new Date(birthDate) > new Date("2006.10.23")) {
            console.log("age under 18..")
            return false
        }

        // TODO: validate VC from VC registry

        return true

    }

    async tallyVotes(): Promise<number> {
        const SEAL = require('node-seal');
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

        // Load the secret key
        const secretKeySerialized = fs.readFileSync('secretKey.txt', 'utf8');
        const secretKey = seal.SecretKey();
        secretKey.load(context, secretKeySerialized);

        const decryptor = seal.Decryptor(context, secretKey);
        const encoder = seal.BatchEncoder(context);

        // Read all encrypted votes from the file
        const votesFilePath = path.join(__dirname, 'encryptedVotes.txt');
        const fileContent = fs.readFileSync(votesFilePath, 'utf8').trim();

        // Check if there are any votes to count
        if (!fileContent) {
            console.log("No votes to count.");
            return -1;
        }
        const encryptedVotes = fileContent.split('\n');  // Split lines into an array of serialized votes


        // Tally object to count votes for each candidate
        const voteCounts: { [key: number]: number } = {};

        encryptedVotes.forEach((serializedVote) => {
            const encryptedVote = seal.CipherText();
            encryptedVote.load(context, serializedVote);
            const decryptedPlainText = decryptor.decrypt(encryptedVote);
            const decodedVote = encoder.decode(decryptedPlainText);

            const candidate = decodedVote[0];  // Assuming each CipherText has one vote value.
            voteCounts[candidate] = (voteCounts[candidate] || 0) + 1;
        });

        // Find the candidate with the highest count
        let topCandidate = -1;
        let maxVotes = 0;
        for (const [candidate, count] of Object.entries(voteCounts)) {
            if (count > maxVotes) {
                maxVotes = count;
                topCandidate = Number(candidate);
            }
        }

        console.log("Top candidate: ", topCandidate)

        // fs.writeFileSync(votesFilePath, ''); // Clears the file after tallying

        return topCandidate;
    }

    async resetVote(): Promise<void> {
        const filePath = path.join(__dirname, 'encryptedVotes.txt');

        // Write an empty string to the file to reset it
        fs.writeFileSync(filePath, '', 'utf8');

        console.log('Votes have been reset.');
    }


}