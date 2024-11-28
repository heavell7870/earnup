import express, { Express, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import config from './configs/index'
import logger from './utils/logger/index'
import { defineRoutes } from './routes/index'
import { connect } from './utils/db/index'
import { errorHandler } from './utils/hanlders/errorHandler'
import { ErrorHandlingMiddleware } from './middlewares/globalErrorHandler'

/* express application with all global level middleware */
const createExpressApp = (): Express => {
    const expressApp = express()
    expressApp.use(
        cors({
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
            // origin: [config.FRONTEND_URL],
            origin: '*',
            credentials: true
        })
    )
    expressApp.use(helmet())
    expressApp.use(express.json())
    expressApp.use(express.urlencoded({ extended: true }))

    // Apply compression middleware with custom configuration
    expressApp.use(
        compression({
            level: 6,
            threshold: 0,
            filter: (req: Request, res: Response) => {
                if (!req.headers['x-no-compression']) {
                    return compression.filter(req, res)
                }
                return false // Don't apply compression if 'x-no-compression' header is present
            }
        })
    )
    // Log an info message for each incoming request
    expressApp.use((req: Request, res: Response, next: NextFunction) => {
        logger.info(`${req.method} ${req.originalUrl}`)
        next()
    })
    //passing app into appRouter
    defineRoutes(expressApp)
    //error handling middleware
    ErrorHandlingMiddleware(expressApp)
    return expressApp
}

/* start the server */
async function startServer(): Promise<void> {
    //starting the server
    const httpServer = createExpressApp()
    //connect database
    let conf = await connect()
    if (conf && conf.connection) {
        logger.info(`mongodb connected on port ${conf.connection.port}`)
    } else {
        logger.error('Failed to connect to MongoDB')
    }
    //listen the server
    const appAddress = await listenServer(httpServer)
    logger.info(`Server is running on ${appAddress.address}:${appAddress.port}`)
}

/*listen the server*/
async function listenServer(expressApp: Express): Promise<{ address: string; port: number }> {
    const serverPort = config.PORT
    const connection = await expressApp.listen(serverPort)
    errorHandler.listenToErrorEvents(connection)
    return connection.address() as { address: string; port: number }
}

export { startServer }

