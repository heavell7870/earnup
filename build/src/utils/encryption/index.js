"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const configs_1 = __importDefault(require("../../configs"));
const ENCRYPTION_KEY = configs_1.default.ENCRYPTION_KEY || 'your-fallback-encryption-key-min-32-chars';
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;
const encrypt = async (text) => {
    try {
        const iv = crypto_1.default.randomBytes(IV_LENGTH);
        const key = Buffer.from(ENCRYPTION_KEY, 'hex');
        const cipher = crypto_1.default.createCipheriv(ALGORITHM, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // Return IV + encrypted data as single base64 string
        return Buffer.from(iv.toString('hex') + ':' + encrypted).toString('base64');
    }
    catch (error) {
        console.log(error);
        throw new Error('Encryption failed');
    }
};
exports.encrypt = encrypt;
const decrypt = async (encryptedData) => {
    try {
        // Convert base64 string back to original format
        const parts = Buffer.from(encryptedData, 'base64').toString().split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        const key = Buffer.from(ENCRYPTION_KEY, 'hex');
        const decipher = crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch (error) {
        throw new Error('Decryption failed');
    }
};
exports.decrypt = decrypt;
//# sourceMappingURL=index.js.map