import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import config from './configs/index.js';
import logger from './utils/logger/index.js';
import { defineRoutes } from './routes/index.js';
import { connect } from './utils/db/index.js';
import { verifyToken } from './middlewares/authMiddleware.js';
import { errorHandler } from './utils/hanlders/errorHandler.js';
import { ErrorHandlingMiddleware } from './middlewares/globalErrorHandler.js';


/* express application with all global level middleware */
const createExpressApp = () => {
    const expressApp = express();
    expressApp.use(
        cors({
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
            // origin: [config.FRONTEND_URL],
            origin:"*",
            credentials: true
        })
    )
    expressApp.use(helmet())
    expressApp.use(express.json());
    expressApp.use(express.urlencoded({ extended: true }));
    // Apply compression middleware with custom configuration
    expressApp.use(
        compression({
            level: 6,
            threshold: 0,
            filter: (req, res) => {
                if (!req.headers['x-no-compression']) {
                    return compression.filter(req, res);
                }
                return false; // Don't apply compression if 'x-no-compression' header is present
            },
        })
    );
    // Log an info message for each incoming request
    expressApp.use((req, res, next) => {
        logger.info(`${req.method} ${req.originalUrl}`);
        next();
    });
    expressApp.use(verifyToken)
    //passing app into appRouter
    defineRoutes(expressApp)
    //error handling middleware
    ErrorHandlingMiddleware(expressApp)
    return expressApp
}

/* start the server */
async function startServer() {
    //starting the server
    const httpServer = createExpressApp();
    //connect database
    let conf = await connect;
    logger.info(`mongodb connected on port ${conf.connection.port}`);
    //listen the server
    const appAddress = await listenServer(httpServer);
    logger.info(`Server is running on ${appAddress.address}:${appAddress.port}`);
}

/*listen the server*/
async function listenServer(expressApp) {
    const serverPort = config.PORT;
    const connection = await expressApp.listen(serverPort);
    errorHandler.listenToErrorEvents(connection)
    return connection.address()
}

export { startServer }