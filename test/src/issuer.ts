import type { DisclosureFrame } from '@sd-jwt/types';
import { SDJwtVcInstance } from '@sd-jwt/sd-jwt-vc';
import { generateSalt, digest } from '@sd-jwt/crypto-nodejs';
import { decryptUtil, generateSignerVerifierUtil } from './crypto-utils';
import { VCInfo, parseToVCInfo } from './myType';


export class Issuer {
    private issuerKeyPair: any;
    private sdJwtVcInstance: SDJwtVcInstance;

    constructor(issuerKeyPair: any) {
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
        const payload = decryptUtil(encryptedPayload, this.issuerKeyPair.privateKey);
        const VC_REGISTRY_ADDRESS = "Seoul National University Bldg 301, Rm 314";

        const vcInfo: VCInfo = parseToVCInfo(payload, VC_REGISTRY_ADDRESS);

        const disclosureFrame: DisclosureFrame<typeof vcInfo> = {
            _sd: ['gender', 'birth_date', 'email', 'name', 'phone_number']
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

        return credential;
    }
}