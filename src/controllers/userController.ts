import { Request, Response } from 'express'
import { UserService } from '../services/userService'
import { catchAsync } from '../utils/hanlders/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from '../utils/hanlders/appResponse'
import { AppError } from '../utils/hanlders/appError'

export class UserController {
    private service: UserService

    constructor() {
        this.service = new UserService()
    }

    createUserProfile = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const userData = req.body
        const newUser = await this.service.createUserProfile(userData)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, newUser, 'User profile created successfully'))
    })

    updateUserProfile = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params
        const updateData = req.body
        const updatedUser = await this.service.updateUserProfile(id, updateData)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, updatedUser, 'User profile updated successfully'))
    })

    getUserByFirebaseId = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { firebaseId } = req.params
        const user = await this.service.getUserByFirebaseId(firebaseId)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, user, 'User profile retrieved successfully'))
    })

    checkUserNameExists = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { userName } = req.params
        const exists = await this.service.checkUserNameExists(userName)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, { exists }, 'Username availability checked'))
    })

    checkEmailExists = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { email } = req.params
        const exists = await this.service.checkEmailExists(email)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, { exists }, 'Email availability checked'))
    })

    getUserById = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params
        const user = await this.service.getUserById(id)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, user, 'User profile retrieved successfully'))
    })

    loginWithEmailPassword = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { email, password } = req.body
        const user = await this.service.loginWithEmailPassword(email, password)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, user, 'User logged in successfully'))
    })
}

