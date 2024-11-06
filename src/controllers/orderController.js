import { OrderService } from '../services/orderService.js'
import { catchAsync } from '../utils/hanlders/catchAsync.js'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from '../utils/hanlders/appResponse.js'
import { AppError } from '../utils/hanlders/appError.js'
import mongoose from 'mongoose'

export class OrderController {
    constructor() {
        this.service = new OrderService()
    }
    cancelOrder = catchAsync(async (req, res) => {
        const { orderId } = req.params
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, 'Token Missing in Headers')
        const cart = await this.service.cancelOrder(req.user, orderId)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, cart, 'Order Cancelled successfully'))
    })
    getAllUserOrders = catchAsync(async (req, res) => {
        let page = parseInt(req.query.page) || 1
        let page_size = parseInt(req.query.pageSize) || 10
        let pipeline = [{ $sort: { createdAt: -1 } }]
        if (req?.user) pipeline.push({ $match: { userId: new mongoose.Types.ObjectId(req.user) } })
        if (req.query.isCod === "true") pipeline.push({ $match: { isCod: true } })
        if (req.query.isCancelled === "true") pipeline.push({ $match: { isCancelled: true } })
        if (req.query.isDelivered === "true") pipeline.push({ $match: { isDelivered: true } })
        if (req.query.isPaid === "true") pipeline.push({ $match: { isPaid: true } })
        if (req.query.isReturn === "true") pipeline.push({ $match: { isReturn: true } })
        if (req.query.isRefund === "true") pipeline.push({ $match: { isRefund: true } })
        if (req.query.isExchange === "true") pipeline.push({ $match: { isExchange: true } })
        pipeline.push({
            $facet: {
                metadata: [{ $count: 'total_records' }],
                records: [{ $skip: (page - 1) * page_size }, { $limit: page_size }]
            }
        })
        const cart = await this.service.getAllOrders(pipeline)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, cart, 'All Orders fetched successfully'))
    })
    getAllStoreOrders = catchAsync(async (req, res) => {
        const { storeId } = req.params
        let page = parseInt(req.query.page) || 1
        let page_size = parseInt(req.query.pageSize) || 10
        let pipeline = [{ $match: { storeId: new mongoose.Types.ObjectId(storeId) } }, { $sort: { createdAt: -1 } }]
        if (req.query.user_id) pipeline.push({ $match: { userId: new mongoose.Types.ObjectId(req.query.user_id) } })
        if (req.query.isCod === "true") pipeline.push({ $match: { isCod: true } })
        if (req.query.isCancelled === "true") pipeline.push({ $match: { isCancelled: true } })
        if (req.query.isDelivered === "true") pipeline.push({ $match: { isDelivered: true } })
        if (req.query.isPaid === "true") pipeline.push({ $match: { isPaid: true } })
        if (req.query.isReturn === "true") pipeline.push({ $match: { isReturn: true } })
        if (req.query.isRefund === "true") pipeline.push({ $match: { isRefund: true } })
        if (req.query.isExchange === "true") pipeline.push({ $match: { isExchange: true } })
        if (req.query.isAssignedToPartner) pipeline.push({ $match: { isAssignedToPartner: true } })
        pipeline.push({
            $group: {
                _id: "$paymentId",
                orders: { $push: "$$ROOT" }
            }
        },
            {
                $facet: {
                    metadata: [{ $count: 'total_records' }],
                    records: [{ $skip: (page - 1) * page_size }, { $limit: page_size }]
                }
            })
        const orders = await this.service.getAllOrdersOfStore(pipeline)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, orders[0], 'All Orders fetched successfully'))
    })
    getAllOrders = catchAsync(async (req, res) => {
        let page = parseInt(req.query.page) || 1
        let page_size = parseInt(req.query.pageSize) || 10
        let pipeline = [{ $sort: { createdAt: -1 } }]
        if (req.query.user_id) pipeline.push({ $match: { userId: new mongoose.Types.ObjectId(req.query.user_id) } })
        if (req.query.store_id) pipeline.push({ $match: { storeId: new mongoose.Types.ObjectId(req.query.store_id) } })
        if (req.query.isCod === "true") pipeline.push({ $match: { isCod: true } })
        if (req.query.isCancelled === "true") pipeline.push({ $match: { isCancelled: true } })
        if (req.query.isDelivered === "true") pipeline.push({ $match: { isDelivered: true } })
        if (req.query.isPaid === "true") pipeline.push({ $match: { isPaid: true } })
        if (req.query.isReturn === "true") pipeline.push({ $match: { isReturn: true } })
        if (req.query.isRefund === "true") pipeline.push({ $match: { isRefund: true } })
        if (req.query.isExchange === "true") pipeline.push({ $match: { isExchange: true } })
        if (req.query.isAssignedToPartner) pipeline.push({ $match: { isAssignedToPartner: true } })
        pipeline.push({
            $group: {
                _id: "$paymentId",
                orders: { $push: "$$ROOT" }
            }
        },
            {
                $facet: {
                    metadata: [{ $count: 'total_records' }],
                    records: [{ $skip: (page - 1) * page_size }, { $limit: page_size }]
                }
            })
        const orders = await this.service.getAllOrders(pipeline)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, orders[0], 'All Orders fetched successfully'))
    })
    updateAOrder = catchAsync(async (req, res) => {
        const { storeId } = req.params
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, 'Token Missing in Headers')
        const cart = await this.service.getCartOfAUser(req.user, storeId)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, cart, 'cart fetched To successfully'))
    })
}
