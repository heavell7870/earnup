import { Request, Response, NextFunction } from 'express'

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

