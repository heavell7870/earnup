import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { ValidConfigurationSchema } from './configSchema'
import { fileURLToPath } from 'url'
import process from 'process'
import logger from '../utils/logger'

interface ConfigInstance {
    config: Record<string, any>
}

class Config {
    private static instance: ConfigInstance | null = null
    public config: Record<string, any>

    private constructor() {
        logger.info('Loading and validating config for the first time...')
        this.config = this.loadAndValidateConfig()
        Config.instance = this
        logger.info('Config loaded and validated')
    }

    private loadAndValidateConfig(): Record<string, any> {
        const environment = process.env.NODE_ENV || 'development'
        // 1. Load environment file from one level up and using process.cwd()
        const envFile = `.env.${environment}`
        const envPath = path.join(process.cwd(), envFile)
        if (!fs.existsSync(envPath)) {
            throw new Error(`Environment file not found: ${envPath}`)
        }
        dotenv.config({ path: envPath })

        const sharedConfigFile = path.join(__dirname, `sharedConfig.json`)
        const config = JSON.parse(fs.readFileSync(sharedConfigFile, 'utf-8'))

        const finalConfig: Record<string, any> = {}
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

    public static getInstance(): ConfigInstance {
        if (!Config.instance) {
            new Config()
        }
        return Config.instance!
    }
}

export default Config.getInstance().config

