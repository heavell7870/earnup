import { CrudRepository } from './index.js'
import userModel from '../models/userModel.js'
import { AppError } from '../utils/hanlders/appError.js'
export class UserRepository extends CrudRepository {
    constructor() {
        super(userModel)
    }
    async getUserAggregation(filter) {
        try {
            let response = await this.model.aggregate(filter)
            return response
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
}
