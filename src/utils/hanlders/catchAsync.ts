import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../../types'

type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

export const catchAsync = (requestHandler: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await requestHandler(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

type AuthRequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>

export const catchAuthAsync = (requestHandler: AuthRequestHandler) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            await requestHandler(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

