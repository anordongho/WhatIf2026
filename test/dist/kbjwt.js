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
exports.KBJwt = void 0;
const utils_1 = require("@sd-jwt/utils");
const jwt_1 = require("./jwt");
const types_1 = require("@sd-jwt/types");
class KBJwt extends jwt_1.Jwt {
    // Checking the validity of the key binding jwt
    // the type unknown is not good, but we don't know at this point how to get the public key of the signer, this is defined in the kbVerifier
    verifyKB(values) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.header || !this.payload || !this.signature) {
                throw new utils_1.SDJWTException('Verify Error: Invalid JWT');
            }
            if (!this.header.alg ||
                this.header.alg === 'none' ||
                !this.header.typ ||
                this.header.typ !== types_1.KB_JWT_TYP ||
                !this.payload.iat ||
                !this.payload.aud ||
                !this.payload.nonce ||
                // this is for backward compatibility with version 06
                !(this.payload.sd_hash ||
                    ((_a = this.payload) === null || _a === void 0 ? void 0 : _a._sd_hash))) {
                throw new utils_1.SDJWTException('Invalid Key Binding Jwt');
            }
            const data = this.getUnsignedToken();
            const verified = yield values.verifier(data, this.signature, values.payload);
            if (!verified) {
                throw new utils_1.SDJWTException('Verify Error: Invalid JWT Signature');
            }
            return { payload: this.payload, header: this.header };
        });
    }
    // This function is for creating KBJwt object for verify properly
    static fromKBEncode(encodedJwt) {
        const { header, payload, signature } = jwt_1.Jwt.decodeJWT(encodedJwt);
        const jwt = new KBJwt({
            header,
            payload,
            signature,
            encoded: encodedJwt,
        });
        return jwt;
    }
}
exports.KBJwt = KBJwt;
