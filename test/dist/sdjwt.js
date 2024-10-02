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
exports.pack = exports.listKeys = exports.SDJwt = void 0;
const decoy_1 = require("./decoy");
const utils_1 = require("@sd-jwt/utils");
const jwt_1 = require("./jwt");
const kbjwt_1 = require("./kbjwt");
const types_1 = require("@sd-jwt/types");
const decode_1 = require("@sd-jwt/decode");
const present_1 = require("@sd-jwt/present");
class SDJwt {
    constructor(data) {
        this.jwt = data === null || data === void 0 ? void 0 : data.jwt;
        this.disclosures = data === null || data === void 0 ? void 0 : data.disclosures;
        this.kbJwt = data === null || data === void 0 ? void 0 : data.kbJwt;
    }
    static decodeSDJwt(sdjwt, hasher) {
        return __awaiter(this, void 0, void 0, function* () {
            const [encodedJwt, ...encodedDisclosures] = sdjwt.split(types_1.SD_SEPARATOR);
            const jwt = jwt_1.Jwt.fromEncode(encodedJwt);
            if (!jwt.payload) {
                throw new Error('Payload is undefined on the JWT. Invalid state reached');
            }
            if (encodedDisclosures.length === 0) {
                return {
                    jwt,
                    disclosures: [],
                };
            }
            const encodedKeyBindingJwt = encodedDisclosures.pop();
            const kbJwt = encodedKeyBindingJwt
                ? kbjwt_1.KBJwt.fromKBEncode(encodedKeyBindingJwt)
                : undefined;
            const { _sd_alg } = (0, decode_1.getSDAlgAndPayload)(jwt.payload);
            const disclosures = yield Promise.all(encodedDisclosures.map((ed) => utils_1.Disclosure.fromEncode(ed, { alg: _sd_alg, hasher })));
            return {
                jwt,
                disclosures,
                kbJwt,
            };
        });
    }
    static fromEncode(encodedSdJwt, hasher) {
        return __awaiter(this, void 0, void 0, function* () {
            const { jwt, disclosures, kbJwt } = yield SDJwt.decodeSDJwt(encodedSdJwt, hasher);
            return new SDJwt({
                jwt,
                disclosures,
                kbJwt,
            });
        });
    }
    present(presentFrame, hasher) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.jwt) === null || _a === void 0 ? void 0 : _a.payload) || !this.disclosures) {
                throw new utils_1.SDJWTException('Invalid sd-jwt: jwt or disclosures is missing');
            }
            const { _sd_alg: alg } = (0, decode_1.getSDAlgAndPayload)(this.jwt.payload);
            const hash = { alg, hasher };
            const hashmap = yield (0, decode_1.createHashMapping)(this.disclosures, hash);
            const { disclosureKeymap } = yield (0, decode_1.unpack)(this.jwt.payload, this.disclosures, hasher);
            const keys = presentFrame
                ? (0, present_1.transformPresentationFrame)(presentFrame)
                : yield this.presentableKeys(hasher);
            const disclosures = keys
                .map((k) => hashmap[disclosureKeymap[k]])
                .filter((d) => d !== undefined);
            const presentSDJwt = new SDJwt({
                jwt: this.jwt,
                disclosures,
                kbJwt: this.kbJwt,
            });
            return presentSDJwt.encodeSDJwt();
        });
    }
    encodeSDJwt() {
        const data = [];
        if (!this.jwt) {
            throw new utils_1.SDJWTException('Invalid sd-jwt: jwt is missing');
        }
        const encodedJwt = this.jwt.encodeJwt();
        data.push(encodedJwt);
        if (this.disclosures && this.disclosures.length > 0) {
            const encodeddisclosures = this.disclosures
                .map((dc) => dc.encode())
                .join(types_1.SD_SEPARATOR);
            data.push(encodeddisclosures);
        }
        data.push(this.kbJwt ? this.kbJwt.encodeJwt() : '');
        return data.join(types_1.SD_SEPARATOR);
    }
    keys(hasher) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, exports.listKeys)(yield this.getClaims(hasher)).sort();
        });
    }
    presentableKeys(hasher) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!((_a = this.jwt) === null || _a === void 0 ? void 0 : _a.payload) || !this.disclosures) {
                throw new utils_1.SDJWTException('Invalid sd-jwt: jwt or disclosures is missing');
            }
            const { disclosureKeymap } = yield (0, decode_1.unpack)((_b = this.jwt) === null || _b === void 0 ? void 0 : _b.payload, this.disclosures, hasher);
            return Object.keys(disclosureKeymap).sort();
        });
    }
    getClaims(hasher) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.jwt) === null || _a === void 0 ? void 0 : _a.payload) || !this.disclosures) {
                throw new utils_1.SDJWTException('Invalid sd-jwt: jwt or disclosures is missing');
            }
            const { unpackedObj } = yield (0, decode_1.unpack)(this.jwt.payload, this.disclosures, hasher);
            return unpackedObj;
        });
    }
}
exports.SDJwt = SDJwt;
const listKeys = (obj, prefix = '') => {
    const keys = [];
    for (const key in obj) {
        if (obj[key] === undefined)
            continue;
        const newKey = prefix ? `${prefix}.${key}` : key;
        keys.push(newKey);
        if (obj[key] && typeof obj[key] === 'object' && obj[key] !== null) {
            keys.push(...(0, exports.listKeys)(obj[key], newKey));
        }
    }
    return keys;
};
exports.listKeys = listKeys;
const pack = (claims, disclosureFrame, hash, saltGenerator) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!disclosureFrame) {
        return {
            packedClaims: claims,
            disclosures: [],
        };
    }
    const sd = (_a = disclosureFrame[types_1.SD_DIGEST]) !== null && _a !== void 0 ? _a : [];
    const decoyCount = (_b = disclosureFrame[types_1.SD_DECOY]) !== null && _b !== void 0 ? _b : 0;
    if (Array.isArray(claims)) {
        const packedClaims = [];
        const disclosures = [];
        const recursivePackedClaims = {};
        for (const key in disclosureFrame) {
            if (key !== types_1.SD_DIGEST) {
                const idx = Number.parseInt(key);
                const packed = yield (0, exports.pack)(claims[idx], disclosureFrame[idx], hash, saltGenerator);
                recursivePackedClaims[idx] = packed.packedClaims;
                disclosures.push(...packed.disclosures);
            }
        }
        for (let i = 0; i < claims.length; i++) {
            const claim = recursivePackedClaims[i]
                ? recursivePackedClaims[i]
                : claims[i];
            /** This part is set discloure for array items.
             *  The example of disclosureFrame of an Array is
             *
             *  const claims = {
             *    array: ['a', 'b', 'c']
             *  }
             *
             *  diclosureFrame: DisclosureFrame<typeof claims> = {
             *    array: {
             *      _sd: [0, 2]
             *    }
             *  }
             *
             *  It means that we want to disclose the first and the third item of the array
             *
             *  So If the index `i` is in the disclosure list(sd), then we create a disclosure for the claim
             */
            // @ts-ignore
            if (sd.includes(i)) {
                const salt = yield saltGenerator(16);
                const disclosure = new utils_1.Disclosure([salt, claim]);
                const digest = yield disclosure.digest(hash);
                packedClaims.push({ [types_1.SD_LIST_KEY]: digest });
                disclosures.push(disclosure);
            }
            else {
                packedClaims.push(claim);
            }
        }
        for (let j = 0; j < decoyCount; j++) {
            const decoyDigest = yield (0, decoy_1.createDecoy)(hash, saltGenerator);
            packedClaims.push({ [types_1.SD_LIST_KEY]: decoyDigest });
        }
        return { packedClaims, disclosures };
    }
    const packedClaims = {};
    const disclosures = [];
    const recursivePackedClaims = {};
    for (const key in disclosureFrame) {
        if (key !== types_1.SD_DIGEST) {
            const packed = yield (0, exports.pack)(
            // @ts-ignore
            claims[key], disclosureFrame[key], hash, saltGenerator);
            recursivePackedClaims[key] = packed.packedClaims;
            disclosures.push(...packed.disclosures);
        }
    }
    const _sd = [];
    for (const key in claims) {
        const claim = recursivePackedClaims[key]
            ? recursivePackedClaims[key]
            : claims[key];
        // @ts-ignore
        if (sd.includes(key)) {
            const salt = yield saltGenerator(16);
            const disclosure = new utils_1.Disclosure([salt, key, claim]);
            const digest = yield disclosure.digest(hash);
            _sd.push(digest);
            disclosures.push(disclosure);
        }
        else {
            packedClaims[key] = claim;
        }
    }
    for (let j = 0; j < decoyCount; j++) {
        const decoyDigest = yield (0, decoy_1.createDecoy)(hash, saltGenerator);
        _sd.push(decoyDigest);
    }
    if (_sd.length > 0) {
        packedClaims[types_1.SD_DIGEST] = _sd.sort();
    }
    return { packedClaims, disclosures };
});
exports.pack = pack;
