import { Request, Response } from 'express'
import { BankAccountService } from '../services/bankAccountService'
import { catchAsync } from '../utils/hanlders/catchAsync'
import { StatusCodes } from 'http-status-codes'
import { ApiResponse } from '../utils/hanlders/appResponse'
import { AuthenticatedRequest } from '../types'

export class BankAccountController {
    private service: BankAccountService

    constructor() {
        this.service = new BankAccountService()
    }

    createBankAccount = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<any> => {
        const bankAccountData = req.body
        const userId = req.user?.id!
        const newBankAccount = await this.service.createBankAccount(bankAccountData, userId)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, newBankAccount, 'Bank account created successfully'))
    })

    updateBankAccount = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params
        const updateData = req.body
        const updatedAccount = await this.service.updateBankAccount(id, updateData)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, updatedAccount, 'Bank account updated successfully'))
    })

    getBankAccountById = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params
        const bankAccount = await this.service.getBankAccountById(id)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, bankAccount, 'Bank account retrieved successfully'))
    })

    getBankAccountsByUserId = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { userId } = req.params
        const bankAccounts = await this.service.getBankAccountsByUserId(userId)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, bankAccounts, 'Bank accounts retrieved successfully'))
    })

    deleteBankAccount = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params
        const deletedAccount = await this.service.deleteBankAccount(id)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, deletedAccount, 'Bank account deleted successfully'))
    })

    verifyBankAccount = catchAsync(async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params
        const verifiedAccount = await this.service.verifyBankAccount(id)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, verifiedAccount, 'Bank account verified successfully'))
    })
}

