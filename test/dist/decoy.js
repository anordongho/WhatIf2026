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
exports.createDecoy = void 0;
const utils_1 = require("@sd-jwt/utils");
// This function creates a decoy value that can be used to obscure SD JWT payload.
// The value is basically a hash of a random salt. So the value is not predictable.
// return value is a base64url encoded string.
const createDecoy = (hash, saltGenerator) => __awaiter(void 0, void 0, void 0, function* () {
    const { hasher, alg } = hash;
    const salt = yield saltGenerator(16);
    const decoy = yield hasher(salt, alg);
    return (0, utils_1.uint8ArrayToBase64Url)(decoy);
});
exports.createDecoy = createDecoy;
