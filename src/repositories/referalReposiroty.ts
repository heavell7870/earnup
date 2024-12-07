import { CrudRepository } from './index'
import { AppError } from '../utils/hanlders/appError'
import { Model } from 'mongoose'
import referralModel, { IReferral } from '../models/referalModel'

export class ReferalRepository extends CrudRepository<IReferral> {
    constructor() {
        super(referralModel as Model<IReferral, any, IReferral>) // Adjusted type casting to match expected Model<IUser>
    }

    async getReferralAggregation(filter: any): Promise<IReferral[]> {
        try {
            const response = await this.model.aggregate(filter)
            return response as IReferral[]
        } catch (error: any) {
            throw new AppError(error.statusCode || 500, error.message, error)
        }
    }
}

