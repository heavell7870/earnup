import { BankAccountRepository } from '../repositories/bankAccountReposiroty'
import { IBankAccount } from '../models/bankAccountModel'
import { AppError } from '../utils/hanlders/appError'
import { StatusCodes } from 'http-status-codes'

export class BankAccountService {
    private repository: BankAccountRepository

    constructor() {
        this.repository = new BankAccountRepository()
    }

    async createBankAccount(bankAccountData: Partial<IBankAccount>, userId: string): Promise<IBankAccount> {
        try {
            // Check if bank account already exists for this user
            const existingAccount = await this.repository.getOne({
                accountNumber: bankAccountData.accountNumber
            })

            if (existingAccount) {
                throw new AppError(StatusCodes.BAD_REQUEST, 'Bank account already exists for this user')
            }

            const existingVpa = await this.repository.getOne({
                vpa: bankAccountData.vpa
            })

            if (existingVpa) {
                throw new AppError(StatusCodes.BAD_REQUEST, 'This VPA is already in use')
            }

            // Create new bank account
            const newBankAccount = await this.repository.create({ ...bankAccountData, userId })
            return newBankAccount
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    async updateBankAccount(id: string, updateData: Partial<IBankAccount>): Promise<IBankAccount | null> {
        try {
            const updatedAccount = await this.repository.updateById(id, updateData)
            if (!updatedAccount) {
                throw new AppError(StatusCodes.NOT_FOUND, 'Bank account not found')
            }

            return updatedAccount
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    async getBankAccountById(id: string): Promise<IBankAccount | null> {
        try {
            const bankAccount = await this.repository.getById(id)
            if (!bankAccount) {
                throw new AppError(StatusCodes.NOT_FOUND, 'Bank account not found')
            }

            return bankAccount
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    async getBankAccountsByUserId(userId: string): Promise<IBankAccount[]> {
        try {
            const bankAccounts = await this.repository.getAll({ userId, isDeleted: false })
            return bankAccounts
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    async deleteBankAccount(id: string): Promise<IBankAccount | null> {
        try {
            // Soft delete by setting isDeleted to true
            const deletedAccount = await this.repository.updateById(id, { isDeleted: true })
            if (!deletedAccount) {
                throw new AppError(StatusCodes.NOT_FOUND, 'Bank account not found')
            }

            return deletedAccount
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    async verifyBankAccount(id: string): Promise<IBankAccount | null> {
        try {
            const verifiedAccount = await this.repository.updateById(id, { isVerified: true })
            if (!verifiedAccount) {
                throw new AppError(StatusCodes.NOT_FOUND, 'Bank account not found')
            }

            return verifiedAccount
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }
}

