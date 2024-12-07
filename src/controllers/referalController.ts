import { Request, Response } from 'express'
import { ReferralService } from '../services/referalService'
import { catchAsync, catchAuthAsync } from '../utils/hanlders/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from '../utils/hanlders/appResponse'
import { AuthenticatedRequest } from '../types'

export class ReferralController {
    private service: ReferralService

    constructor() {
        this.service = new ReferralService()
    }

    createReferral = catchAuthAsync(async (req: AuthenticatedRequest, res: Response): Promise<any> => {
        const referralData = req.body
        const { id } = req.user!
        const newReferral = await this.service.createReferral(referralData, id)
        return res.status(StatusCodes.CREATED).send(new ApiResponse(StatusCodes.CREATED, newReferral, 'Referral created successfully'))
    })

    getReferralByCode = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { code } = req.params
        const referral = await this.service.getReferralByCode(code)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, referral, 'Referral retrieved successfully'))
    })

    getReferralsByReferrerId = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { referrerId } = req.params
        const referrals = await this.service.getReferralsByReferrerId(referrerId)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, referrals, 'Referrals retrieved successfully'))
    })

    getReferralsByRefereeId = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { refereeId } = req.params
        const referrals = await this.service.getReferralsByRefereeId(refereeId)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, referrals, 'Referrals retrieved successfully'))
    })

    getReferralById = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params
        const referral = await this.service.getReferralById(id)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, referral, 'Referral retrieved successfully'))
    })
}

