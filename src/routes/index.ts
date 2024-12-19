import logger from '../utils/logger'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { Express, Request, Response } from 'express'
import router from './router'
import path from 'path'

export function defineRoutes(expressApp: Express): void {
    logger.info('Defining routes...')

    expressApp.use('/api/v1', router)
    console.log({ __dirname })
    // Serve static files from the 'files' directory
    expressApp.use('/api/v1/files', express.static(path.join(__dirname, '../../../files')))
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

