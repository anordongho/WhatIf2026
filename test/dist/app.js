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
const express_1 = __importDefault(require("express"));
const sd_jwt_vc_1 = require("@sd-jwt/sd-jwt-vc");
const ethers_1 = require("ethers");
const path_1 = __importDefault(require("path"));
const jwt_1 = require("./jwt");
const node_crypto_1 = __importDefault(require("node:crypto"));
const sdjwt_1 = require("./sdjwt");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
app.listen('8001', () => {
    console.log('Server started');
});
const { privateKey } = node_crypto_1.default.generateKeyPairSync('ed25519');
const testSigner = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = node_crypto_1.default.sign(null, Buffer.from(data), privateKey);
    return Buffer.from(sig).toString('base64url');
});
// SD-JWT 생성기 설정
const sdJwt = new sd_jwt_vc_1.SDJwtVcInstance({
    signer: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const wallet = ethers_1.ethers.Wallet.createRandom();
        return wallet.signMessage(data);
    }),
    verifier: (data, signature) => __awaiter(void 0, void 0, void 0, function* () {
        // 서명 검증 로직 (optional)
        return true;
    }),
    signAlg: 'HS256',
});
// JWT 발급 API
app.post('/issue-vc', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body.payload;
        if (!payload) {
            return res.status(400).json({ error: 'Payload is required' });
        }
        // JWT 생성
        const jwt = new jwt_1.Jwt({
            header: {
                alg: 'HS256',
                typ: 'JWT'
            },
            payload
        });
        // JWT 서명
        yield jwt.sign(testSigner);
        const sdJwt = new sdjwt_1.SDJwt({
            jwt,
            disclosures: [],
        });
        const encoded = sdJwt.encodeSDJwt();
        console.log(jwt);
        console.log(sdJwt);
        console.log(encoded);
    }
    catch (error) {
        console.error('Error issuing JWT:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
