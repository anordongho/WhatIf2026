import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

// ABI를 직접 코드에 포함 (사용자가 채울 예정)
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "vcId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "holderPublicKey",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "issuanceDate",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "expirationDate",
				"type": "uint256"
			}
		],
		"name": "VCRegistered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "vcId",
				"type": "bytes32"
			}
		],
		"name": "getVCAttributes",
		"outputs": [
			{
				"internalType": "address",
				"name": "holderPublicKey",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "issuanceDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "expirationDate",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "vcSchemeHash",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "vcId",
				"type": "bytes32"
			}
		],
		"name": "isVCValid",
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
		"inputs": [],
		"name": "issuer",
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
				"internalType": "bytes32",
				"name": "vcId",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "holderPublicKey",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "expirationDate",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "vcSchemeHash",
				"type": "bytes32"
			}
		],
		"name": "registerVC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "vcId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "newExpirationDate",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "newVcSchemeHash",
				"type": "bytes32"
			}
		],
		"name": "updateVC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

// 바이트코드를 직접 코드에 포함 (간략화)
const contractBytecode = "60a0604052348015600e575f80fd5b50336080526080516106446100385f395f8181605e015281816101a201526103d101526106445ff3fe608060405234801561000f575f80fd5b5060043610610055575f3560e01c80631d1438481461005957806346f69a4d1461009d578063800d3ac8146100c05780639b41205f146100d5578063aeba8d7e14610112575b5f80fd5b6100807f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b6100b06100ab366004610522565b610125565b6040519015158152602001610094565b6100d36100ce366004610539565b610197565b005b6100e86100e3366004610522565b61031a565b604080516001600160a01b0390951685526020850193909352918301526060820152608001610094565b6100d3610120366004610562565b6103c6565b5f81815260208181526040808320815160808101835281546001600160a01b03168152600182015493810184905260028201549281019290925260030154606082015290820361017757505f92915050565b5f61018663386d4380426105a7565b604090920151909111159392505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146101e85760405162461bcd60e51b81526004016101df906105cc565b60405180910390fd5b5f83815260208190526040812060010154900361023b5760405162461bcd60e51b81526020600482015260116024820152701590c8191bd95cc81b9bdd08195e1a5cdd607a1b60448201526064016101df565b5f61024a63386d4380426105a7565b90508083116102ad5760405162461bcd60e51b815260206004820152602960248201527f4e65772065787069726174696f6e2064617465206d75737420626520696e207460448201526868652066757475726560b81b60648201526084016101df565b5f84815260208181526040918290206002810186905560038101859055805460019091015483519081529182018690526001600160a01b03169186917f85559c6cf8414cbfbce4c7a2823fac6ae9cfd54ed9d57cee39ae3ed08eee9cf5910160405180910390a350505050565b5f81815260208181526040808320815160808101835281546001600160a01b03168152600182015493810184905260028201549281019290925260030154606082015282918291829182036103a55760405162461bcd60e51b81526020600482015260116024820152701590c8191bd95cc81b9bdd08195e1a5cdd607a1b60448201526064016101df565b80516020820151604083015160609093015191989097509195509350915050565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461040e5760405162461bcd60e51b81526004016101df906105cc565b5f61041d63386d4380426105a7565b905080831161047c5760405162461bcd60e51b815260206004820152602560248201527f45787069726174696f6e2064617465206d75737420626520696e207468652066604482015264757475726560d81b60648201526084016101df565b604080516080810182526001600160a01b038681168083526020808401868152848601898152606086018981525f8d8152808552889020965187546001600160a01b03191696169590951786559051600186015551600285015591516003909301929092558251848152908101869052909187917f85559c6cf8414cbfbce4c7a2823fac6ae9cfd54ed9d57cee39ae3ed08eee9cf5910160405180910390a35050505050565b5f60208284031215610532575f80fd5b5035919050565b5f805f6060848603121561054b575f80fd5b505081359360208301359350604090920135919050565b5f805f8060808587031215610575575f80fd5b8435935060208501356001600160a01b0381168114610592575f80fd5b93969395505050506040820135916060013590565b818103818111156105c657634e487b7160e01b5f52601160045260245ffd5b92915050565b60208082526022908201527f4f6e6c79206973737565722063616e2063616c6c20746869732066756e63746960408201526137b760f11b60608201526080019056fea264697066735822122006af17ce5100e7632f980ec36abd615bae572c85a99f99fc0223482ca29814f964736f6c634300081a0033";

const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

async function main() {
    // 컨트랙트 배포
    console.log('Deploying the contract...');
    const factory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);
    const contract = await factory.deploy({ gasLimit: 1000000 });
    await contract.deployed();
    console.log(`Contract deployed at: ${contract.address}`);

    // VC 등록
    console.log('Registering a VC...');
    const vcId = ethers.utils.id('vc1');
    const holderPublicKey = '0x01e708B4e91842a677adDF1Ec5211875f070C5f2';
    const expirationDate = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const vcSchemeHash = ethers.utils.id('scheme1');

    const tx = await contract.registerVC(vcId, holderPublicKey, expirationDate, vcSchemeHash);
    await tx.wait();
    console.log(`VC registered with ID: ${vcId}`);

    // VC 속성 조회
    console.log('Getting VC attributes...');
    const vcAttributes = await contract.getVCAttributes(vcId);
    console.log('VC Attributes:', {
        holderPublicKey: vcAttributes[0],
        issuanceDate: vcAttributes[1].toNumber(),
        expirationDate: vcAttributes[2].toNumber(),
        vcSchemeHash: vcAttributes[3]
    });

    // VC 유효성 확인
    const isValid = await contract.isVCValid(vcId);
    console.log(`Is VC valid? ${isValid}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});