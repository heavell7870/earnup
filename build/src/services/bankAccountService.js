"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountService = void 0;
const bankAccountReposiroty_1 = require("../repositories/bankAccountReposiroty");
const appError_1 = require("../utils/hanlders/appError");
const http_status_codes_1 = require("http-status-codes");
class BankAccountService {
    constructor() {
        this.repository = new bankAccountReposiroty_1.BankAccountRepository();
    }
    async createBankAccount(bankAccountData, userId) {
        try {
            // Check if bank account already exists for this user
            const existingAccount = await this.repository.getOne({
                accountNumber: bankAccountData.accountNumber
            });
            if (existingAccount) {
                throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Bank account already exists for this user');
            }
            // Create new bank account
            const newBankAccount = await this.repository.create({ ...bankAccountData, userId });
            return newBankAccount;
        }
        catch (error) {
            throw new appError_1.AppError(error.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    async updateBankAccount(id, updateData) {
        try {
            const updatedAccount = await this.repository.updateById(id, updateData);
            if (!updatedAccount) {
                throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Bank account not found');
            }
            return updatedAccount;
        }
        catch (error) {
            throw new appError_1.AppError(error.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    async getBankAccountById(id) {
        try {
            const bankAccount = await this.repository.getById(id);
            if (!bankAccount) {
                throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Bank account not found');
            }
            return bankAccount;
        }
        catch (error) {
            throw new appError_1.AppError(error.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    async getBankAccountsByUserId(userId) {
        try {
            const bankAccounts = await this.repository.getAll({ userId, isDeleted: false });
            return bankAccounts;
        }
        catch (error) {
            throw new appError_1.AppError(error.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    async deleteBankAccount(id) {
        try {
            // Soft delete by setting isDeleted to true
            const deletedAccount = await this.repository.updateById(id, { isDeleted: true });
            if (!deletedAccount) {
                throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Bank account not found');
            }
            return deletedAccount;
        }
        catch (error) {
            throw new appError_1.AppError(error.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    async verifyBankAccount(id) {
        try {
            const verifiedAccount = await this.repository.updateById(id, { isVerified: true });
            if (!verifiedAccount) {
                throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Bank account not found');
            }
            return verifiedAccount;
        }
        catch (error) {
            throw new appError_1.AppError(error.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}
exports.BankAccountService = BankAccountService;
//# sourceMappingURL=bankAccountService.js.map