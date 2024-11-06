import logger from '../utils/logger/index.js'
import { StatusCodes } from 'http-status-codes'
import router from './router.js'

export function defineRoutes(expressApp) {
    logger.info('Defining routes...')

    expressApp.use('/api/v1', router)
    // health check
    expressApp.get('/health-check', (_, res) => {
        res.status(StatusCodes.OK).send({ message: 'helath check successful', status: true })
    })
    // 404 handler
    expressApp.use((_, res) => {
        res.status(StatusCodes.NOT_FOUND).send('Api Not Found')
    })
    logger.info('Routes defined')
}
