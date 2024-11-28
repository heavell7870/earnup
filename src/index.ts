import { startServer } from './server'
import logger from './utils/logger'

const StartServer = async () => {
    logger.info('Starting server...')
    await startServer()
}
StartServer()

