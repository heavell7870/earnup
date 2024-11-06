import { PaymentService } from '../services/paymentService.js'
import { catchAsync } from '../utils/hanlders/catchAsync.js'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from '../utils/hanlders/appResponse.js'
import { AppError } from '../utils/hanlders/appError.js'
import mongoose from 'mongoose'

export class PaymentController {
    constructor() {
        this.service = new PaymentService()
    }
    initiateOrder = catchAsync(async (req, res) => {
        const { storeId,isCod } = req.body
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, 'Token Missing in Headers')
        const cart = await this.service.createOrder(req.user, storeId, isCod)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, cart, 'cart fetched To successfully'))
    })
    verifyOrder = catchAsync(async (req, res) => {
        const { storeId } = req.params
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, 'Token Missing in Headers')
        const cart = await this.service.verifyOrder(req.user, storeId)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, cart, 'cart fetched To successfully'))
    })
    getAllPaymentsOfUser = catchAsync(async (req, res) => {
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, 'Token Missing in Headers')
        let page=parseInt(req.query.page) || 1
        let page_size=parseInt(req.query.pageSize) || 10
        let pipeline=[{$sort:{paymentTime:-1}}]
        if(req?.user){
            pipeline.push({$match:{userId: new mongoose.Types.ObjectId(req.user)}})
        }
        pipeline.push({
            $facet: {
                metadata: [{ $count: 'total_records' }],
                records: [{ $skip: (page - 1) * page_size }, { $limit: page_size }]
            }
        })
        const cart = await this.service.getPaymentsOfUser(pipeline)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, cart, 'payments list fetched successfully'))
    })
    getAllPayments = catchAsync(async (req, res) => {
        let page=parseInt(req.query.page) || 1
        let page_size=parseInt(req.query.pageSize) || 10
        let pipeline=[{$sort:{paymentTime:-1}}]
        if(req?.user){
            pipeline.push({$match:{userId: new mongoose.Types.ObjectId(req.user)}})
        }
        pipeline.push({
            $facet: {
                metadata: [{ $count: 'total_records' }],
                records: [{ $skip: (page - 1) * page_size }, { $limit: page_size }]
            }
        })
        const cart = await this.service.getAllPayments(pipeline)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, cart, 'payments list fetched successfully'))
    })
}
