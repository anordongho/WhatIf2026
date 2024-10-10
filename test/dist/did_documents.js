"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployDID = deployDID;
exports.getAttribute = getAttribute;
const dotenv_1 = __importDefault(require("dotenv"));
const ethers_1 = require("ethers");
dotenv_1.default.config();
// Ethereum DID Registry ABI (간소화된 버전)
const EthereumDIDRegistryABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "identity",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "changeOwner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "identity",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "name",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes",
                "name": "value",
                "type": "bytes"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "validTo",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "previousChange",
                "type": "uint256"
            }
        ],
        "name": "DIDAttributeChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "identity",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "previousChange",
                "type": "uint256"
            }
        ],
        "name": "DIDOwnerChanged",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "identity",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "name",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "value",
                "type": "bytes"
            },
            {
                "internalType": "uint256",
                "name": "validity",
                "type": "uint256"
            }
        ],
        "name": "setAttribute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "attributes",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "changed",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "identity",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "name",
                "type": "bytes32"
            }
        ],
        "name": "getAttribute",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "identity",
                "type": "address"
            }
        ],
        "name": "identityOwner",
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
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "owners",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
function deployDID() {
    return __awaiter(this, void 0, void 0, function* () {
        // 환경 변수에서 프라이빗 키와 Infura 프로젝트 ID를 가져옵니다
        const privateKey = "c505618b9bf373fa6cccf77afb081cc7d8c4eaee1a0f7be02b0bdf4649d6cac3";
        const infuraProjectId = "f1db94136c374e1f85a561d4171dcd2a";
        if (!privateKey || !infuraProjectId) {
            throw new Error('환경 변수가 설정되지 않았습니다.');
        }
        // Sepolia 테스트넷에 연결
        const provider = new ethers_1.ethers.providers.InfuraProvider('sepolia', infuraProjectId);
        const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
        // Ethereum DID Registry 컨트랙트 주소 (Sepolia 테스트넷)
        const registryAddress = '0x50e927D05131592A90Bc6EDF8BD50fc979a55Dd7';
        // 컨트랙트 인스턴스 생성
        const contract = new ethers_1.ethers.Contract(registryAddress, EthereumDIDRegistryABI, wallet);
        // DID 문서 데이터 준비
        const identity = wallet.address;
        const name = ethers_1.ethers.utils.formatBytes32String('did/pub/Ed25519/veriKey/base64');
        const value = ethers_1.ethers.utils.toUtf8Bytes('publicKeyBase64Here');
        const validity = 31536000; // 1년 (초 단위)
        try {
            // setAttribute 함수 호출
            const tx = yield contract.setAttribute(identity, name, value, validity);
            console.log('Transaction sent:', tx.hash);
            // 트랜잭션 확인 대기
            const receipt = yield tx.wait();
            console.log('Transaction confirmed in block:', receipt.blockNumber);
            console.log('DID document deployed successfully');
            console.log('Your DID:', `did:ethr:sepolia:${identity}`);
        }
        catch (error) {
            console.error('Error deploying DID document:', error);
        }
    });
}
// getAttribute 함수 추가
function getAttribute(identity, attributeName) {
    return __awaiter(this, void 0, void 0, function* () {
        // 환경 변수에서 Infura 프로젝트 ID를 가져옵니다
        const infuraProjectId = "f1db94136c374e1f85a561d4171dcd2a";
        if (!infuraProjectId) {
            throw new Error('Infura 프로젝트 ID가 설정되지 않았습니다.');
        }
        // Sepolia 테스트넷에 연결
        const provider = new ethers_1.ethers.providers.InfuraProvider('sepolia', infuraProjectId);
        // Ethereum DID Registry 컨트랙트 주소 (Sepolia 테스트넷)
        const registryAddress = '0x50e927D05131592A90Bc6EDF8BD50fc979a55Dd7';
        // 컨트랙트 인스턴스 생성 (provider만 필요)
        const contract = new ethers_1.ethers.Contract(registryAddress, EthereumDIDRegistryABI, provider);
        try {
            // 속성 이름을 bytes32로 변환
            const nameBytes32 = ethers_1.ethers.utils.formatBytes32String(attributeName);
            // getAttribute 함수 호출
            const attribute = yield contract.getAttribute(identity, nameBytes32);
            console.log('Attribute value (raw bytes):', attribute);
            // bytes 값을 UTF-8 문자열로 변환 (필요한 경우)
            const attributeString = ethers_1.ethers.utils.toUtf8String(attribute);
            console.log('Attribute value (as string):', attributeString);
        }
        catch (error) {
            console.error('Error getting attribute:', error);
        }
    });
}
// 새로운 DID document deploy
// deployDID().catch((error) => {
//   console.error('Unhandled error:', error);
//   process.exit(1);
// });
// 기존 DID 조회
getAttribute("0x01e708B4e91842a677adDF1Ec5211875f070C5f2", 'did/pub/Ed25519/veriKey/base64').catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
