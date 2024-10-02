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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jwt = void 0;
const utils_1 = require("@sd-jwt/utils");
const decode_1 = require("@sd-jwt/decode");
// This class is used to create and verify JWT
// Contains header, payload, and signature
class Jwt {
    constructor(data) {
        this.header = data === null || data === void 0 ? void 0 : data.header;
        this.payload = data === null || data === void 0 ? void 0 : data.payload;
        this.signature = data === null || data === void 0 ? void 0 : data.signature;
        this.encoded = data === null || data === void 0 ? void 0 : data.encoded;
    }
    static decodeJWT(jwt) {
        return (0, decode_1.decodeJwt)(jwt);
    }
    static fromEncode(encodedJwt) {
        const { header, payload, signature } = Jwt.decodeJWT(encodedJwt);
        const jwt = new Jwt({
            header,
            payload,
            signature,
            encoded: encodedJwt,
        });
        return jwt;
    }
    setHeader(header) {
        this.header = header;
        this.encoded = undefined;
        return this;
    }
    setPayload(payload) {
        this.payload = payload;
        this.encoded = undefined;
        return this;
    }
    getUnsignedToken() {
        if (!this.header || !this.payload) {
            throw new utils_1.SDJWTException('Serialize Error: Invalid JWT');
        }
        if (this.encoded) {
            const parts = this.encoded.split('.');
            if (parts.length !== 3) {
                throw new utils_1.SDJWTException(`Invalid JWT format: ${this.encoded}`);
            }
            const unsignedToken = parts.slice(0, 2).join('.');
            return unsignedToken;
        }
        const header = (0, utils_1.base64urlEncode)(JSON.stringify(this.header));
        const payload = (0, utils_1.base64urlEncode)(JSON.stringify(this.payload));
        return `${header}.${payload}`;
    }
    sign(signer) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.getUnsignedToken();
            this.signature = yield signer(data);
            return this.encodeJwt();
        });
    }
    encodeJwt() {
        if (this.encoded) {
            return this.encoded;
        }
        if (!this.header || !this.payload || !this.signature) {
            throw new utils_1.SDJWTException('Serialize Error: Invalid JWT');
        }
        const header = (0, utils_1.base64urlEncode)(JSON.stringify(this.header));
        const payload = (0, utils_1.base64urlEncode)(JSON.stringify(this.payload));
        const signature = this.signature;
        const compact = `${header}.${payload}.${signature}`;
        this.encoded = compact;
        return compact;
    }
    verify(verifier) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.signature) {
                throw new utils_1.SDJWTException('Verify Error: no signature in JWT');
            }
            const data = this.getUnsignedToken();
            const verified = yield verifier(data, this.signature);
            if (!verified) {
                throw new utils_1.SDJWTException('Verify Error: Invalid JWT Signature');
            }
            return { payload: this.payload, header: this.header };
        });
    }
}
exports.Jwt = Jwt;
