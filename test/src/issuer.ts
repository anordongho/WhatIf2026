import type { DisclosureFrame } from '@sd-jwt/types';
import { SDJwtVcInstance } from '@sd-jwt/sd-jwt-vc';
import { generateSalt, digest } from '@sd-jwt/crypto-nodejs';
import { decryptUtil, encryptDataWithAES, encryptSymmetricKeyWithRSA, generateSignerVerifierUtil, generateSymmetricKeyAndIv } from './crypto-utils';
import { KeyPair, VCEncrypted, VCInfo, parseToVCInfo } from './myType';

const holderPublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxr1MtIoqYujusHIG54d9\nhFOIrOdG9B1HL3k8iazIGqU3eXhZNzgfutfwrWglsV+apXbTGDivLmFOZNXvhmc9\nWDmAng5p056qQG9OCDXQ2Vt4NLGHk5kRgR0nJZfjdkXZLrGCoc9q49jLzxeRJDSV\nm7IWlxNdzbZlEG7AJrK8jfZE2K69ARXqukbUubrvuDLj0BCiSRmCuRs7Q0iD5iFz\nToSXzcOO0WOcqtUGQXPjbBMP2hV8gbJZLA+bfdznxAp9vaubJ0mu/NFAPE8VprQa\n5sP5hiS9HFhvtfmJpYaae4fahegt11Bn27RwU1fVKIdvpg4cLaaalEn0aPMERDDS\nyQIDAQAB\n-----END PUBLIC KEY-----\n";

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

    public async issueVC(encryptedPayload: any) {
        try {
            const payload = decryptUtil(encryptedPayload, this.issuerKeyPair.privateKey);
            const VC_REGISTRY_ADDRESS = "Seoul National University Bldg 301, Rm 314";

            const vcInfo: VCInfo = parseToVCInfo(payload, VC_REGISTRY_ADDRESS);

            const disclosureFrame: DisclosureFrame<typeof vcInfo> = {
                _sd: selectively_disclosable
            };

            const credential = await this.sdJwtVcInstance.issue(
                {
                    iss: 'Issuer',
                    iat: new Date().getTime(),
                    vct: 'ExampleCredentials',
                    ...vcInfo,
                },
                disclosureFrame,
            )

            if (!credential) {
                throw new Error('Failed to issue VC');
            }

            // register the VC to the vc_registry

            return credential;
        } catch (error) {
            console.error('Error issuing VC:', error);
        }
    }

    public encryptCredential(credential: any): VCEncrypted {
        const { aesKey, iv } = generateSymmetricKeyAndIv();
        const encryptedCredentialandIV = encryptDataWithAES(credential, aesKey, iv);
        const encryptedSymmetricKey = encryptSymmetricKeyWithRSA(aesKey, holderPublicKey);
        return { encryptedCredentialandIV, encryptedSymmetricKey };
    }
}