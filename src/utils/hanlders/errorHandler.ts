import util from 'util'
import { AppError } from './appError'
import { disconnect } from '../db'
import mongoose from 'mongoose'
import process from 'process'
import logger from '../logger'

let httpServerRef: any

interface ErrorHandler {
    listenToErrorEvents: (httpServer: any) => void
    handleError: (errorToHandle: any) => Promise<AppError | undefined>
}

const errorHandler: ErrorHandler = {
    listenToErrorEvents: (httpServer: any) => {
        httpServerRef = httpServer

        process.on('uncaughtException', async (error: Error) => {
            await errorHandler.handleError(error)
        })

        process.on('unhandledRejection', async (reason: any) => {
            await errorHandler.handleError(reason)
        })

        process.on('SIGTERM', async () => {
            logger.error('App received SIGTERM event, try to gracefully close the server')
            await terminateHttpServerAndExit()
        })

        process.on('SIGINT', async () => {
            logger.error('App received SIGINT event, try to gracefully close the server')
            await terminateHttpServerAndExit()
        })
    },

    handleError: async (errorToHandle: any): Promise<AppError | undefined> => {
        try {
            const appError = normalizeError(errorToHandle)
            return appError
        } catch (handlingError) {
            console.log(handlingError)
            process.stdout.write('The error handler failed. Here are the handler failure and then the origin error that it tried to handle: ')
            process.stdout.write(JSON.stringify(handlingError))
            process.stdout.write(JSON.stringify(errorToHandle))
        }
    }
}

const terminateHttpServerAndExit = async (): Promise<void> => {
    if (httpServerRef) {
        await new Promise((resolve) => httpServerRef.close(resolve)) // Graceful shutdown
        await disconnect()
    }
    process.exit()
}

const normalizeError = (errorToHandle: any): AppError => {
    if (errorToHandle instanceof AppError) {
        return errorToHandle
    }
    if (errorToHandle instanceof Error) {
        const appError = new AppError(500, errorToHandle.message)
        appError.stack = errorToHandle.stack
        return appError
    }
    if (errorToHandle instanceof mongoose.Error) {
        const appError = new AppError(500, errorToHandle.message)
        appError.stack = errorToHandle.stack
        return appError
    }

    const inputType = typeof errorToHandle
    return new AppError(500, `Error Handler received a non-error instance with type - ${inputType}, value - ${util.inspect(errorToHandle)}`)
}

export { errorHandler, normalizeError }

