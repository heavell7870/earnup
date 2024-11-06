import { StatusCodes } from 'http-status-codes'
import { CartRepository } from '../repositories/cartReposiroty.js'
import { UserRepository } from '../repositories/userReposiroty.js'
import { ProductRepository } from '../repositories/productRepository.js'
import { VarientRepository } from '../repositories/productRepository.js'
import { StoreRepository } from '../repositories/productRepository.js'
import { OrderRepository } from '../repositories/orderReposiroty.js'
import { PaymentRepository } from '../repositories/paymentReposiroty.js'
import { AppError } from '../utils/hanlders/appError.js'
import { publishMessage } from '../utils/rabbitMq/index.js'
import Buffer from 'buffer';

export class OrderService {
    constructor() {
        this.repository = new OrderRepository()
        this.paymentRepository = new PaymentRepository()
        this.cartRepository = new CartRepository()
        this.userRepository = new UserRepository()
        this.productRepository = new ProductRepository()
        this.varientRepository = new VarientRepository()
        this.storeRepository = new StoreRepository()
    }

    async cancelOrder(userId, orderId) {
        try {
            let orderDetails = await this.repository.getOne({userId, _id: orderId})
            if (!orderDetails) throw new AppError(StatusCodes.NOT_FOUND, 'order not found')
            if(orderDetails?.createdAt < new Date(new Date().getTime() - 60 * 1000)) throw new AppError(StatusCodes.BAD_REQUEST, 'order cannot be cancelled')
            if(orderDetails?.isCancelled) throw new AppError(StatusCodes.BAD_REQUEST, 'order already cancelled')
            if(orderDetails?.isDelivered) throw new AppError(StatusCodes.BAD_REQUEST, 'order already delivered')
            const cancelledOrder = await this.repository.updateById(orderId, {$push: {orderProgressList: { status: 'order cancelled', time: new Date() }},$set: { status: 'cancelled' }})
            if (!cancelledOrder) throw new AppError(StatusCodes.BAD_REQUEST, 'order not cancelled')
            const payment = await this.paymentRepository.getById(orderDetails?.paymentId )
            if (!payment) throw new AppError(StatusCodes.BAD_REQUEST, 'payment not found')
            const cancelledPayment = await this.paymentRepository.updateById(payment._id, {$set: { status: 'cancelled' }})
            if (!cancelledPayment) throw new AppError(StatusCodes.BAD_REQUEST, 'payment not cancelled')
            if(orderDetails.isPaid&&payment.paymentStatus === 'success'){
                await publishMessage('cancelPayment', JSON.stringify(Buffer.from(cancelledPayment)))
            }
            await publishMessage('resetProductQuantity', JSON.stringify(Buffer.from(cancelledOrder)))
            return cancelledOrder
        }catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async getAllOrdersOfStore(filter) {
        try {
            const payment = await this.repository.orderAggregation(filter)
            return payment
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async getAllOrdersOfUser(filter) {
        try {
            const payments = await this.repository.orderAggregation(filter)
            return payments
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }

    async getAllOrders(filter) {
        try {
            const payments = await this.repository.orderAggregation(filter)
            return payments
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
}   