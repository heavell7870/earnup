import { Request, Response } from 'express'
import { AdminService } from '../services/admin.service'
import { catchAsync } from '../utils/hanlders/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from '../utils/hanlders/appResponse'
import { AppError } from '../utils/hanlders/appError'

export class AdminController {
    private service: AdminService

    constructor() {
        this.service = new AdminService()
    }

    getEarningsGrowth = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { startDate, endDate, userId } = req.query

        const startDateObj = startDate ? new Date(startDate as string) : undefined
        const endDateObj = endDate ? new Date(endDate as string) : undefined

        const earningsGrowth = await this.service.getEarningsGrowth(userId as string, startDateObj, endDateObj)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, earningsGrowth, 'Earnings growth data retrieved successfully'))
    })

    getWeeklyActiveUsers = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { startDate, endDate } = req.query

        const startDateObj = new Date(startDate as string)
        const endDateObj = new Date(endDate as string)

        const weeklyActiveUsers = await this.service.getWeeklyActiveUsers(startDateObj, endDateObj)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, weeklyActiveUsers, 'Weekly active users data retrieved successfully'))
    })

    getWeeklyAdWatchedStats = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { startDate, endDate } = req.query

        const startDateObj = new Date(startDate as string)
        const endDateObj = new Date(endDate as string)

        const weeklyAdWatchedStats = await this.service.getWeeklyAdWatchedStats(startDateObj, endDateObj)
        return res
            .status(StatusCodes.OK)
            .send(new ApiResponse(StatusCodes.OK, weeklyAdWatchedStats, 'Weekly ad watched stats retrieved successfully'))
    })

    getUserList = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { page, limit, ...filter } = req.query

        const pagination = {
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 10
        }

        const userList = await this.service.getUserList(filter, pagination)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, userList, 'User list retrieved successfully'))
    })

    getUserData = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { userId } = req.params

        if (!userId) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'User ID is required')
        }

        const userData = await this.service.getUserData(userId)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, userData, 'User data retrieved successfully'))
    })
}

