"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountController = void 0;
const bankAccountService_1 = require("../services/bankAccountService");
const catchAsync_1 = require("../utils/hanlders/catchAsync");
const http_status_codes_1 = require("http-status-codes");
const appResponse_1 = require("../utils/hanlders/appResponse");
class BankAccountController {
    constructor() {
        this.createBankAccount = (0, catchAsync_1.catchAsync)(async (req, res) => {
            var _a;
            const bankAccountData = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const newBankAccount = await this.service.createBankAccount(bankAccountData, userId);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, newBankAccount, 'Bank account created successfully'));
        });
        this.updateBankAccount = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const updateData = req.body;
            const updatedAccount = await this.service.updateBankAccount(id, updateData);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, updatedAccount, 'Bank account updated successfully'));
        });
        this.getBankAccountById = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const bankAccount = await this.service.getBankAccountById(id);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, bankAccount, 'Bank account retrieved successfully'));
        });
        this.getBankAccountsByUserId = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { userId } = req.params;
            const bankAccounts = await this.service.getBankAccountsByUserId(userId);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, bankAccounts, 'Bank accounts retrieved successfully'));
        });
        this.deleteBankAccount = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const deletedAccount = await this.service.deleteBankAccount(id);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, deletedAccount, 'Bank account deleted successfully'));
        });
        this.verifyBankAccount = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const verifiedAccount = await this.service.verifyBankAccount(id);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, verifiedAccount, 'Bank account verified successfully'));
        });
        this.service = new bankAccountService_1.BankAccountService();
    }
}
exports.BankAccountController = BankAccountController;
//# sourceMappingURL=bankAccountController.js.map