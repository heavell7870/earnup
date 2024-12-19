"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVerifyBankAccount = exports.validateDeleteBankAccount = exports.validateGetBankAccountsByUserId = exports.validateGetBankAccountById = exports.validateUpdateBankAccount = exports.validateCreateBankAccount = void 0;
const joi_1 = __importDefault(require("joi"));
exports.validateCreateBankAccount = {
    body: joi_1.default.object().keys({
        accountHolderName: joi_1.default.string().required().messages({
            'string.empty': 'Account holder name is required',
            'any.required': 'Account holder name is required'
        }),
        accountNumber: joi_1.default.string().required().messages({
            'string.empty': 'Account number is required',
            'any.required': 'Account number is required'
        }),
        ifscCode: joi_1.default.string().required().messages({
            'string.empty': 'IFSC code is required',
            'any.required': 'IFSC code is required'
        }),
        bankName: joi_1.default.string().required().messages({
            'string.empty': 'Bank name is required',
            'any.required': 'Bank name is required'
        }),
        accountType: joi_1.default.string().valid('SAVINGS', 'CURRENT').default('SAVINGS')
    })
};
exports.validateUpdateBankAccount = {
    params: joi_1.default.object().keys({
        id: joi_1.default.string().required().messages({
            'string.empty': 'Bank account ID is required',
            'any.required': 'Bank account ID is required'
        })
    }),
    body: joi_1.default.object().keys({
        accountHolderName: joi_1.default.string().optional(),
        accountNumber: joi_1.default.string().optional(),
        ifscCode: joi_1.default.string().optional(),
        bankName: joi_1.default.string().optional(),
        accountType: joi_1.default.string().valid('SAVINGS', 'CURRENT').optional()
    })
};
exports.validateGetBankAccountById = {
    params: joi_1.default.object().keys({
        id: joi_1.default.string().required().messages({
            'string.empty': 'Bank account ID is required',
            'any.required': 'Bank account ID is required'
        })
    })
};
exports.validateGetBankAccountsByUserId = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().required().messages({
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        })
    })
};
exports.validateDeleteBankAccount = {
    params: joi_1.default.object().keys({
        id: joi_1.default.string().required().messages({
            'string.empty': 'Bank account ID is required',
            'any.required': 'Bank account ID is required'
        })
    })
};
exports.validateVerifyBankAccount = {
    params: joi_1.default.object().keys({
        id: joi_1.default.string().required().messages({
            'string.empty': 'Bank account ID is required',
            'any.required': 'Bank account ID is required'
        })
    })
};
//# sourceMappingURL=bankAccountValidation.js.map