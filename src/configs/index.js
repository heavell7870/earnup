import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import logger from '../utils/logger/index.js'
import { ValidConfigurationSchema } from './configSchema.js'
import { fileURLToPath } from 'url';
import process from 'process';
class Config {
    constructor() {
        if (!Config.instance) {
            logger.info('Loading and validating config for the first time...')
            this.config = this.loadAndValidateConfig()
            Config.instance = this
            logger.info('Config loaded and validated')
        }
        return Config.instance
    }

    loadAndValidateConfig() {
        const environment = process.env.NODE_ENV || 'development'

        // 1. Load environment file from one level up and using __dirname
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)
        const envFile = `.env.${environment}`
        const envPath = path.join(__dirname, '..', '..', envFile)
        if (!fs.existsSync(envPath)) {
            throw new Error(`Environment file not found: ${envPath}`)
        }
        dotenv.config({ path: envPath })

        const sharedConfigFile = path.join(__dirname, `sharedConfig.json`)
        if (fs.existsSync(sharedConfigFile)) {
        }
        let config = JSON.parse(fs.readFileSync(sharedConfigFile))

        const finalConfig = {}
        for (const key in ValidConfigurationSchema.describe().keys) {
            if (Object.prototype.hasOwnProperty.call(process.env, key)) {
                finalConfig[key] = process.env[key] // Prioritize environment variables
            } else if (config.hasOwnProperty(key)) {
                finalConfig[key] = config[key] // Fallback to config file value
            }
        }

        // 4. Load the schema file
        if (!ValidConfigurationSchema) {
            throw new Error('Schema file not found')
        }
        const { error, value: validatedConfig } = ValidConfigurationSchema.validate(finalConfig)
        if (error) {
            const missingProperties = error.details.map((detail) => detail.path[0])
            throw new Error(`Config validation error: missing properties ${missingProperties}`)
        }
        return validatedConfig
    }

    static getInstance() {
        if (!Config.instance) {
            new Config()
        }
        return Config.instance
    }
}

export default Config.getInstance().config
