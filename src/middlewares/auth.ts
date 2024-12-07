import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../types'
import * as admin from 'firebase-admin'
import { UserService } from '../services/userService'
import { AppError } from '../utils/hanlders/appError'
import { StatusCodes } from 'http-status-codes'
import { catchAuthAsync } from '../utils/hanlders/catchAsync'

const userService = new UserService()

export const verifyAuthToken = catchAuthAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'No token provided')
        }

        const token = authHeader.split(' ')[1]

        // Verify the Firebase token
        const decodedToken = await admin.auth().verifyIdToken(token)

        if (!decodedToken) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid token')
        }

        // Get user from database using firebase ID
        const user = await userService.getUserByFirebaseId(decodedToken.uid)

        if (!user) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'User not found')
        }

        // Attach user to request object
        req.user = user
        next()
    } catch (error) {
        if (error instanceof AppError) {
            throw error
        }
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Authentication failed')
    }
})

