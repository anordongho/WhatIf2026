import type { DisclosureFrame } from '@sd-jwt/types';
import { SDJwtVcInstance } from '@sd-jwt/sd-jwt-vc';
import { generateSalt, digest } from '@sd-jwt/crypto-nodejs';
import { decryptUtil, decryptUtilAES, encryptUtilAES, generateSignerVerifierUtil } from './crypto-utils';
import { AESEncrypted, KeyPair, VCEncrypted, VCInfo, VPEncrypted, VPInfo, parseToVCInfo } from './myType';
import { ethers } from 'ethers';
import { VCRegistry } from './verifiable_data_registry';

const holderPublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxr1MtIoqYujusHIG54d9\nhFOIrOdG9B1HL3k8iazIGqU3eXhZNzgfutfwrWglsV+apXbTGDivLmFOZNXvhmc9\nWDmAng5p056qQG9OCDXQ2Vt4NLGHk5kRgR0nJZfjdkXZLrGCoc9q49jLzxeRJDSV\nm7IWlxNdzbZlEG7AJrK8jfZE2K69ARXqukbUubrvuDLj0BCiSRmCuRs7Q0iD5iFz\nToSXzcOO0WOcqtUGQXPjbBMP2hV8gbJZLA+bfdznxAp9vaubJ0mu/NFAPE8VprQa\n5sP5hiS9HFhvtfmJpYaae4fahegt11Bn27RwU1fVKIdvpg4cLaaalEn0aPMERDDS\nyQIDAQAB\n-----END PUBLIC KEY-----\n";
const holderEthereumAddress = "0x01e708B4e91842a677adDF1Ec5211875f070C5f2";
const selectively_disclosable: Array<keyof VCInfo> = ['name', 'id', 'unique_id', 'email', 'address', 'phone_number', 'gender', 'birth_date', 'citizenship'];

export class Issuer {
    private issuerKeyPair: KeyPair;
    private sdJwtVcInstance: SDJwtVcInstance;

    constructor(issuerKeyPair: KeyPair) {
        this.issuerKeyPair = issuerKeyPair;
        const { signer, verifier } = generateSignerVerifierUtil(issuerKeyPair.privateKey, issuerKeyPair.publicKey);
        this.sdJwtVcInstance = new SDJwtVcInstance({
            signer,
            verifier,
            signAlg: 'RS256', // Using RS256 for RSA signature algorithm
            hasher: digest,   // Assuming digest function is already defined
            hashAlg: 'SHA-256',
            saltGenerator: generateSalt, // Assuming saltGenerator is defined
        });
    }

    public async issueVC(encryptedPayload: AESEncrypted) {
        try {
            const decryptedData = decryptUtilAES(encryptedPayload, this.issuerKeyPair.privateKey);
            const payload = JSON.parse(decryptedData);
     
            // VC Registry에 등록
            const vcRegistry = new VCRegistry(
                "https://sepolia.infura.io/v3/f1db94136c374e1f85a561d4171dcd2a",
                "c505618b9bf373fa6cccf77afb081cc7d8c4eaee1a0f7be02b0bdf4649d6cac3"
            );
            
            // VC Registry에 등록
            const vcId = ethers.utils.id(payload.id); // 유니크한 ID 생성
            const holderAddress = "0x01e708B4e91842a677adDF1Ec5211875f070C5f2"; // 홀더의 이더리움 주소
            const expirationDate = Math.floor(Date.now() / 1000) + 31536000; // 1년 후 만료
            const vcSchemeHash = ethers.utils.id(JSON.stringify(payload)); // VC 내용의 해시
     
            try {
                await vcRegistry.registerVC(vcId, holderAddress, expirationDate, vcSchemeHash);
                console.log("VC registered on blockchain:", vcId);
            } catch (error) {
                console.error("Failed to register VC on blockchain:", error);
                throw new Error("Failed to register VC on blockchain");
            }
     
            const vcInfo: VCInfo = parseToVCInfo(payload, vcId);
     
            const credential = await this.sdJwtVcInstance.issue(
                {
                    iss: 'Issuer',
                    iat: new Date().getTime(),
                    vct: 'ExampleCredentials',
                    ...vcInfo,
                },
                {
                    _sd: selectively_disclosable
                },
            )
     
            if (!credential) {
                throw new Error('Failed to issue VC');
            }
     
            return credential;
     
        } catch (error) {
            console.error('Error issuing VC:', error);
            throw error;
        }
     }
     
     public encryptCredential(credential: any): VCEncrypted {
        return encryptUtilAES(credential, holderPublicKey);
     }
}