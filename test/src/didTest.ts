

import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

const StandardDIDRegistryABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "DocumentAlreadyExists",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "DocumentNotActive",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "DocumentNotFound",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidInput",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotAuthorized",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "did",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "authId",
				"type": "string"
			}
		],
		"name": "AuthenticationAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "did",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "DIDDocumentCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "did",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "DIDDocumentUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "did",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "DocumentDeactivated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "did",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "IdentityVerified",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "did",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "keyId",
				"type": "string"
			}
		],
		"name": "PublicKeyAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "did",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "serviceId",
				"type": "string"
			}
		],
		"name": "ServiceAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "did",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "authId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "authType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "publicKeyId",
				"type": "string"
			}
		],
		"name": "addAuthentication",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "did",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "keyId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "keyType",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "publicKeyBytes",
				"type": "bytes"
			}
		],
		"name": "addPublicKey",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "did",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "serviceId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "serviceType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "endpoint",
				"type": "string"
			}
		],
		"name": "addService",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "authentications",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "authType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "publicKeyId",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "did",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "context",
				"type": "string"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "keyType",
						"type": "string"
					},
					{
						"internalType": "bytes",
						"name": "publicKeyBytes",
						"type": "bytes"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct StandardDIDRegistry.PublicKey[]",
				"name": "initialKeys",
				"type": "tuple[]"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "authType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "publicKeyId",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct StandardDIDRegistry.Authentication[]",
				"name": "initialAuth",
				"type": "tuple[]"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "serviceType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "endpoint",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct StandardDIDRegistry.Service[]",
				"name": "initialServices",
				"type": "tuple[]"
			}
		],
		"name": "createCompleteDIDDocument",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "did",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "context",
				"type": "string"
			}
		],
		"name": "createDIDDocument",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "did",
				"type": "string"
			}
		],
		"name": "deactivateDIDDocument",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "didDocuments",
		"outputs": [
			{
				"internalType": "string",
				"name": "context",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "created",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "updated",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "governmentAuthority",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "did",
				"type": "string"
			}
		],
		"name": "isIdentityVerified",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "publicKeys",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "keyType",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "publicKeyBytes",
				"type": "bytes"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "did",
				"type": "string"
			}
		],
		"name": "resolveDID",
		"outputs": [
			{
				"internalType": "string",
				"name": "context",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "keyType",
						"type": "string"
					},
					{
						"internalType": "bytes",
						"name": "publicKeyBytes",
						"type": "bytes"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct StandardDIDRegistry.PublicKey[]",
				"name": "keys",
				"type": "tuple[]"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "authType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "publicKeyId",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct StandardDIDRegistry.Authentication[]",
				"name": "auths",
				"type": "tuple[]"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "serviceType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "endpoint",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct StandardDIDRegistry.Service[]",
				"name": "srvcs",
				"type": "tuple[]"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "lastUpdated",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "services",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "serviceType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "endpoint",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "did",
				"type": "string"
			}
		],
		"name": "verifyIdentity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const CONTRACT_ADDRESS = '0xbC49aA79B8Ed4F2fc43c3fef78dA406016bE416A';


//const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
//const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
//const contract = new ethers.Contract(CONTRACT_ADDRESS, StandardDIDRegistryABI, wallet);

class DIDRegistryClient {
    private static TX_OPTIONS = {
        gasLimit: 200000,  // 가스 리미트 낮춤
        maxFeePerGas: ethers.utils.parseUnits('3', 'gwei'),  // 최대 가스 가격
        maxPriorityFeePerGas: ethers.utils.parseUnits('1.5', 'gwei')  // 우선순위 가스 가격
    };
    private provider: ethers.providers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private contract: ethers.Contract;

    constructor(rpcUrl: string, privateKey: string) {
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, StandardDIDRegistryABI, this.wallet);
    }


    // DID 문서 조회
    async resolveDID(did: string) {
        try {
            const result = await this.contract.resolveDID(did);
            const didDocument = {
                context: result[0],
                id: result[1],
                publicKeys: result[2].map((key: any) => ({
                    id: key.id,
                    keyType: key.keyType,
                    publicKeyBytes: key.publicKeyBytes,
                    active: key.active
                })),
                authentications: result[3].map((auth: any) => ({
                    id: auth.id,
                    authType: auth.authType,
                    publicKeyId: auth.publicKeyId,
                    active: auth.active
                })),
                services: result[4].map((service: any) => ({
                    id: service.id,
                    serviceType: service.serviceType,
                    endpoint: service.endpoint,
                    active: service.active
                })),
                active: result[5],
                lastUpdated: result[6].toNumber()
            };
            console.log('Resolved DID Document:', didDocument);
            return didDocument;
        } catch (error) {
            console.error('Error resolving DID:', error);
            throw error;
        }
    }
    async addPublicKey(did: string, keyId: string, keyType: string, publicKeyBytes: Uint8Array) {
        try {
            const tx = await this.contract.addPublicKey(did, keyId, keyType, publicKeyBytes, 
                DIDRegistryClient.TX_OPTIONS
            );
            const receipt = await tx.wait();
            console.log(`Public key added. Transaction hash: ${receipt.transactionHash}`);
            return receipt;
        } catch (error) {
            console.error('Error adding public key:', error);
            throw error;
        }
    }

    async addAuthentication(did: string, authId: string, authType: string, publicKeyId: string) {
        try {
            const tx = await this.contract.addAuthentication(did, authId, authType, publicKeyId, 
                DIDRegistryClient.TX_OPTIONS
            );
            const receipt = await tx.wait();
            console.log(`Authentication added. Transaction hash: ${receipt.transactionHash}`);
            return receipt;
        } catch (error) {
            console.error('Error adding authentication:', error);
            throw error;
        }
    }

    async addService(did: string, serviceId: string, serviceType: string, endpoint: string) {
        try {
            const tx = await this.contract.addService(did, serviceId, serviceType, endpoint, 
                DIDRegistryClient.TX_OPTIONS
            );
            const receipt = await tx.wait();
            console.log(`Service added. Transaction hash: ${receipt.transactionHash}`);
            return receipt;
        } catch (error) {
            console.error('Error adding service:', error);
            throw error;
        }
    }

    // 신원 확인 상태 조회
    async isIdentityVerified(did: string): Promise<boolean> {
        try {
            const isVerified = await this.contract.isIdentityVerified(did);
            console.log(`Identity verification status for ${did}: ${isVerified}`);
            return isVerified;
        } catch (error) {
            console.error('Error checking identity verification:', error);
            throw error;
        }
    }
    async checkAuthority() {
        try {
            const authority = await this.contract.governmentAuthority();
            console.log('Government Authority:', authority);
            console.log('Current Account:', this.wallet.address);
            return authority.toLowerCase() === this.wallet.address.toLowerCase();
        } catch (error) {
            console.error('Error checking authority:', error);
            throw error;
        }
    }

    // DID 문서 존재 여부 확인 함수 추가
    async checkDocument(did: string) {
        try {
            const doc = await this.contract.didDocuments(did);
            console.log('Existing document:', doc);
            return doc;
        } catch (error) {
            console.error('Error checking document:', error);
            throw error;
        }
    }

    async createDIDDocument(did: string, context: string) {
        try {
            const tx = await this.contract.createDIDDocument(did, context, 
                DIDRegistryClient.TX_OPTIONS
            );
            const receipt = await tx.wait();
            console.log(`DID Document created. Transaction hash: ${receipt.transactionHash}`);
            return receipt;
        } catch (error) {
            console.error('Error creating DID document:', error);
            throw error;
        }
    }

}

// 사용 예시
async function main() {
    const client = new DIDRegistryClient(
        process.env.SEPOLIA_RPC_URL!,
        process.env.PRIVATE_KEY!
    );

    try {
         // Issuer의 DID Document 조회
         const issuerDID = "did:eth:0x01e708b4e91842a677addf1ec5211875f070c5f2";
         console.log("Fetching Issuer's DID Document...");
         const didDocument = await client.resolveDID(issuerDID);
         console.log("Issuer's DID Document:", JSON.stringify(didDocument, null, 2));
 
        // // Issuer의 이더리움 주소로 DID 생성
        // const issuerAddress = "0x01e708B4e91842a677adDF1Ec5211875f070C5f2";
        // const did = `did:eth:${issuerAddress.toLowerCase()}`;
        // const context = "https://www.w3.org/ns/did/v1";

        // // 1. DID Document 생성
        // console.log("Creating Issuer DID Document...");
        // await client.createDIDDocument(did, context);
        
        // // 2. Issuer의 Secp256k1 공개키 추가
        // console.log("Adding Issuer's public key...");
        // const keyId = "key-1";
        // const keyType = "EcdsaSecp256k1VerificationKey2019";
        // const publicKeyBytes = ethers.utils.arrayify(issuerAddress);
        // await client.addPublicKey(did, keyId, keyType, publicKeyBytes);

        // // 3. 인증 방법 추가
        // console.log("Adding authentication method...");
        // const authId = "auth-1";
        // const authType = "EcdsaSecp256k1SignatureAuthentication2019";
        // await client.addAuthentication(did, authId, authType, keyId);

        // // 4. DID Management 서비스 추가
        // console.log("Adding DID Management service...");
        // await client.addService(
        //     did,
        //     "did-management",
        //     "DIDManagementService",
        //     "https://did-management.example.com"
        // );

        // // 5. VC 발급 서비스 추가
        // console.log("Adding Credential service...");
        // await client.addService(
        //     did,
        //     "credential-service",
        //     "CredentialService",
        //     "https://credential.example.com"
        // );

        // // 6. 최종 DID Document 확인
        // console.log("Fetching final DID Document...");
        // const didDocument = await client.resolveDID(did);
        // console.log("Final DID Document:", JSON.stringify(didDocument, null, 2));

    } catch (error: any) {
        console.error('Error details:', {
            reason: error?.reason,
            code: error?.code,
            message: error?.message
        });
    }
}

// 실행
if (require.main === module) {
    main().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

export { DIDRegistryClient };

export interface PublicKey {
    id: string;
    keyType: string;
    publicKeyBytes: string;
    active: boolean;
}