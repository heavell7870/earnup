"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidConfigurationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ValidConfigurationSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string().valid('development', 'staging', 'production').default('development').description('node env is missing'),
    PORT: joi_1.default.number().min(1000).default(9889).description('port number is missing'),
    MONGO_CONN_STR: joi_1.default.string().required().description('mongo prefix missing in config file'),
    ENCRYPTION_KEY: joi_1.default.string().required().description('encryption key is missing in config file')
}).unknown();
//# sourceMappingURL=configSchema.js.map