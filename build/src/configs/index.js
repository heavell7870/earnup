"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const configSchema_1 = require("./configSchema");
const process_1 = __importDefault(require("process"));
const logger_1 = __importDefault(require("../utils/logger"));
class Config {
    constructor() {
        logger_1.default.info('Loading and validating config for the first time...');
        this.config = this.loadAndValidateConfig();
        Config.instance = this;
        logger_1.default.info('Config loaded and validated');
    }
    loadAndValidateConfig() {
        const environment = process_1.default.env.NODE_ENV || 'development';
        // 1. Load environment file from one level up and using process.cwd()
        const envFile = `.env.${environment}`;
        const envPath = path_1.default.join(process_1.default.cwd(), envFile);
        if (!fs_1.default.existsSync(envPath)) {
            throw new Error(`Environment file not found: ${envPath}`);
        }
        dotenv_1.default.config({ path: envPath });
        const sharedConfigFile = path_1.default.join(__dirname, `sharedConfig.json`);
        const config = JSON.parse(fs_1.default.readFileSync(sharedConfigFile, 'utf-8'));
        const finalConfig = {};
        for (const key in configSchema_1.ValidConfigurationSchema.describe().keys) {
            if (Object.prototype.hasOwnProperty.call(process_1.default.env, key)) {
                finalConfig[key] = process_1.default.env[key]; // Prioritize environment variables
            }
            else if (config.hasOwnProperty(key)) {
                finalConfig[key] = config[key]; // Fallback to config file value
            }
        }
        // 4. Load the schema file
        if (!configSchema_1.ValidConfigurationSchema) {
            throw new Error('Schema file not found');
        }
        const { error, value: validatedConfig } = configSchema_1.ValidConfigurationSchema.validate(finalConfig);
        if (error) {
            const missingProperties = error.details.map((detail) => detail.path[0]);
            throw new Error(`Config validation error: missing properties ${missingProperties}`);
        }
        return validatedConfig;
    }
    static getInstance() {
        if (!Config.instance) {
            new Config();
        }
        return Config.instance;
    }
}
Config.instance = null;
exports.default = Config.getInstance().config;
//# sourceMappingURL=index.js.map