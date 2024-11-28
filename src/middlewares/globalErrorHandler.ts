import { Request, Response, NextFunction, Application } from 'express'
import { errorHandler } from '../utils/hanlders/errorHandler'
import logger from '../utils/logger'
import configs from '../configs'

export interface CustomError extends Error {
    isTrusted?: boolean
    statusCode?: number
}

export function ErrorHandlingMiddleware(expressApp: Application) {
    expressApp.use(async (error: CustomError, req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            console.log('ErrorHandlingMiddleware')
            if (error && typeof error === 'object') {
                if (error.isTrusted === undefined || error.isTrusted === null) {
                    error.isTrusted = true
                }
            }
            let err = await errorHandler.handleError(error)
            const response = {
                ...error,
                message: error.message,
                ...(configs.NODE_ENV === 'development' ? { stack: error.stack } : {})
            }
            if (configs.NODE_ENV === 'development') {
                logger.error(response)
            }
            console.log('ErrorHandlingMiddleware1')
            return res.status(error.statusCode || 500).send(response)
        } catch (error) {
            console.log(error)
        }
    })
}

