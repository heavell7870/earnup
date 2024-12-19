import { CrudRepository } from './index'
import { AppError } from '../utils/hanlders/appError'
import { Model } from 'mongoose'
import { IBankAccount } from '../models/bankAccountModel'
import bankAccountModel from '../models/bankAccountModel'

export class BankAccountRepository extends CrudRepository<IBankAccount> {
    constructor() {
        super(bankAccountModel as Model<IBankAccount, any, IBankAccount>)
    }

    async getBankAccountAggregation(filter: any): Promise<IBankAccount[]> {
        try {
            const response = await this.model.aggregate(filter)
            return response as IBankAccount[]
        } catch (error: any) {
            throw new AppError(error.statusCode || 500, error.message, error)
        }
    }
}

