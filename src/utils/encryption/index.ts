import crypto from 'crypto'
import configs from '../../configs'

const ENCRYPTION_KEY = configs.ENCRYPTION_KEY || 'your-fallback-encryption-key-min-32-chars'
const ALGORITHM = 'aes-256-cbc'
const IV_LENGTH = 16

export const encrypt = async (text: string): Promise<string> => {
    try {
        const iv = crypto.randomBytes(IV_LENGTH)
        const key = Buffer.from(ENCRYPTION_KEY, 'hex')
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

        let encrypted = cipher.update(text, 'utf8', 'hex')
        encrypted += cipher.final('hex')

        // Return IV + encrypted data as single base64 string
        return Buffer.from(iv.toString('hex') + ':' + encrypted).toString('base64')
    } catch (error) {
        console.log(error)
        throw new Error('Encryption failed')
    }
}

export const decrypt = async (encryptedData: string): Promise<string> => {
    try {
        // Convert base64 string back to original format
        const parts = Buffer.from(encryptedData, 'base64').toString().split(':')

        const iv = Buffer.from(parts[0], 'hex')
        const encrypted = parts[1]
        const key = Buffer.from(ENCRYPTION_KEY, 'hex')

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
        let decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')

        return decrypted
    } catch (error) {
        throw new Error('Decryption failed')
    }
}

