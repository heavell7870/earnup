import { CrudRepository } from './index'
import userModel, { IUser } from '../models/userModel'
import { AppError } from '../utils/hanlders/appError'
import { Model } from 'mongoose'

export class UserRepository extends CrudRepository<IUser> {
    constructor() {
        super(userModel as Model<IUser, any, IUser>) // Adjusted type casting to match expected Model<IUser>
    }

    async getUserAggregation(filter: any): Promise<IUser[]> {
        try {
            const response = await this.model.aggregate(filter)
            return response as IUser[]
        } catch (error: any) {
            throw new AppError(error.statusCode || 500, error.message, error)
        }
    }
}

