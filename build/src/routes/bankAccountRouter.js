"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bankAccountController_1 = require("../controllers/bankAccountController");
const validator_1 = require("../validator");
const bankAccountValidation_1 = require("../validator/bankAccountValidation");
const auth_1 = require("../middlewares/auth");
const bankAccountRouter = express_1.default.Router();
const bankAccountController = new bankAccountController_1.BankAccountController();
// Create bank account
bankAccountRouter.post('/', auth_1.verifyAuthToken, (0, validator_1.validate)(bankAccountValidation_1.validateCreateBankAccount), bankAccountController.createBankAccount);
// Update bank account
bankAccountRouter.put('/:id', auth_1.verifyAuthToken, (0, validator_1.validate)(bankAccountValidation_1.validateUpdateBankAccount), bankAccountController.updateBankAccount);
// Get bank account by ID
bankAccountRouter.get('/:id', auth_1.verifyAuthToken, (0, validator_1.validate)(bankAccountValidation_1.validateGetBankAccountById), bankAccountController.getBankAccountById);
// Get bank accounts by user ID
bankAccountRouter.get('/user/:userId', auth_1.verifyAuthToken, (0, validator_1.validate)(bankAccountValidation_1.validateGetBankAccountsByUserId), bankAccountController.getBankAccountsByUserId);
// Delete bank account
bankAccountRouter.delete('/:id', auth_1.verifyAuthToken, (0, validator_1.validate)(bankAccountValidation_1.validateDeleteBankAccount), bankAccountController.deleteBankAccount);
// Verify bank account
bankAccountRouter.patch('/verify/:id', auth_1.verifyAuthToken, (0, validator_1.validate)(bankAccountValidation_1.validateVerifyBankAccount), bankAccountController.verifyBankAccount);
exports.default = bankAccountRouter;
//# sourceMappingURL=bankAccountRouter.js.map