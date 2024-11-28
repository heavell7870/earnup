import mongoose from 'mongoose'
import config from '../../configs'
import logger from '../logger'

class DatabaseConnection {
    static instance: DatabaseConnection | null = null
    isConnected: boolean = false

    constructor() {
        if (!DatabaseConnection.instance) {
            this.connect = this.connect.bind(this)
            this.disconnect = this.disconnect.bind(this)
            DatabaseConnection.instance = this
        }
    }

    async connect(): Promise<mongoose.Mongoose | void> {
        if (this.isConnected) {
            logger.info('Already connected to MongoDB')
            return
        }

        mongoose.connection.once('open', () => {
            logger.info('MongoDB connection is open')
            this.isConnected = true
        })

        mongoose.connection.on('error', (error) => {
            logger.info('MongoDB connection error', error)
            this.isConnected = false
        })

        try {
            const connection = await mongoose.connect(`${config.MONGO_CONN_STR}`, {
                autoIndex: true,
                autoCreate: true
            })
            logger.info('Connecting to MongoDB...')
            return connection
        } catch (error) {
            console.error('Failed to connect to MongoDB', error)
            this.isConnected = false
        }
    }

    async disconnect(): Promise<void> {
        if (!this.isConnected) {
            logger.info('Not connected to MongoDB')
            return
        }

        logger.info('Disconnecting from MongoDB...')
        await mongoose.disconnect()
        this.isConnected = false
        logger.info('Disconnected from MongoDB')
    }

    static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            new DatabaseConnection()
        }
        return DatabaseConnection.instance as DatabaseConnection
    }
}

const varOcg = DatabaseConnection.getInstance()
export const connect = varOcg.connect
export const disconnect = varOcg.disconnect

