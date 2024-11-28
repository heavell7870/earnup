import { Request, Response } from 'express'
import { UserService } from '../services/userService'
import { catchAsync } from '../utils/hanlders/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from '../utils/hanlders/appResponse'

export class UserController {
    private service: UserService

    constructor() {
        this.service = new UserService()
    }

    loginWithFacebook = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { token } = req.body
        const userData = await this.service.loginWithFacebook(token)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, userData, 'Login successful'))
    })

    loginWithGoogle = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { token } = req.body
        const userData = await this.service.loginWithGoogle(token)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, userData, 'Login successful'))
    })

    loginWithEmailPassword = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { email, password } = req.body
        const userData = await this.service.loginWithEmailPassword(email, password)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, userData, 'Login successful'))
    })

    signUpWithEmailPassword = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { email, password, fullName, phone, userName } = req.body
        const userData = await this.service.signUpWithEmailPassword(email, password, fullName, phone, userName)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, userData, 'Signup successful'))
    })

    logout = catchAsync(async (req: Request, res: Response): Promise<any> => {
        // Implement logout logic if necessary
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, {}, 'Logged out successfully'))
    })

    refreshToken = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { refreshToken } = req.body
        const newToken = await this.service.refreshToken(refreshToken)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, { token: newToken }, 'Token refreshed successfully'))
    })

    changePassword = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { userId, newPassword } = req.body
        await this.service.changePassword(userId, newPassword)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, {}, 'Password changed successfully'))
    })
}

