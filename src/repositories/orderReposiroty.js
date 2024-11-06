import { CrudRepository } from './index.js'
import orderModel from '../models/orderModel.js'
import { AppError } from '../utils/hanlders/appError.js'
export class OrderRepository extends CrudRepository {
    constructor() {
        super(orderModel)
    }
    async orderAggregation(filter) {
        try {
            let response = await this.model.aggregate(filter)
            return response
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
}
