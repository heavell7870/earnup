import express, { Router } from 'express'
import { BankAccountController } from '../controllers/bankAccountController'
import { validate } from '../validator'
import {
    validateCreateBankAccount,
    validateUpdateBankAccount,
    validateGetBankAccountById,
    validateGetBankAccountsByUserId,
    validateDeleteBankAccount,
    validateVerifyBankAccount
} from '../validator/bankAccountValidation'
import { verifyAuthToken } from '../middlewares/auth'

const bankAccountRouter: Router = express.Router()
const bankAccountController = new BankAccountController()

// Create bank account
bankAccountRouter.post('/', verifyAuthToken, validate(validateCreateBankAccount as any), bankAccountController.createBankAccount)

// Update bank account
bankAccountRouter.put('/:id', verifyAuthToken, validate(validateUpdateBankAccount as any), bankAccountController.updateBankAccount)

// Get bank account by ID
bankAccountRouter.get('/:id', verifyAuthToken, validate(validateGetBankAccountById as any), bankAccountController.getBankAccountById)

// Get bank accounts by user ID
bankAccountRouter.get(
    '/user/:userId',
    verifyAuthToken,
    validate(validateGetBankAccountsByUserId as any),
    bankAccountController.getBankAccountsByUserId
)

// Delete bank account
bankAccountRouter.delete('/:id', verifyAuthToken, validate(validateDeleteBankAccount as any), bankAccountController.deleteBankAccount)

// Verify bank account
bankAccountRouter.patch('/verify/:id', verifyAuthToken, validate(validateVerifyBankAccount as any), bankAccountController.verifyBankAccount)

export default bankAccountRouter

