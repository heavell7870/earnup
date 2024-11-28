import logger from '../utils/logger'
import { StatusCodes } from 'http-status-codes'
import { Express, Request, Response } from 'express'
import router from './router'

export function defineRoutes(expressApp: Express): void {
    logger.info('Defining routes...')

    expressApp.use('/api/v1', router)
    // health check
    expressApp.get('/health-check', (req: Request, res: Response) => {
        res.status(StatusCodes.OK).send({ message: 'health check successful', status: true })
    })
    // 404 handler
    expressApp.use((req: Request, res: Response) => {
        res.status(StatusCodes.NOT_FOUND).send('Api Not Found')
    })
    logger.info('Routes defined')
}

