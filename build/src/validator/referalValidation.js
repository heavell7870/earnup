"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateReferralRewardStatus = exports.validateGetReferralById = exports.validateGetReferralsByRefereeId = exports.validateGetReferralsByReferrerId = exports.validateGetReferralByCode = exports.validateUpdateReferralStatus = exports.validateCreateReferral = void 0;
const joi_1 = __importDefault(require("joi"));
exports.validateCreateReferral = {
    body: joi_1.default.object().keys({
        refereeId: joi_1.default.string().required().messages({
            'string.empty': 'Referee ID is required',
            'any.required': 'Referee ID is required'
        })
    })
};
exports.validateUpdateReferralStatus = {
    params: joi_1.default.object().keys({
        id: joi_1.default.string().required().messages({
            'string.empty': 'Referral ID is required',
            'any.required': 'Referral ID is required'
        })
    }),
    body: joi_1.default.object().keys({
        status: joi_1.default.string().valid('PENDING', 'COMPLETED', 'CANCELLED').required(),
        rewardStatus: joi_1.default.string().valid('PENDING', 'PAID', 'CANCELLED').optional(),
        rewardAmount: joi_1.default.number().optional()
    })
};
exports.validateGetReferralByCode = {
    params: joi_1.default.object().keys({
        code: joi_1.default.string().required().messages({
            'string.empty': 'Referral code is required',
            'any.required': 'Referral code is required'
        })
    })
};
exports.validateGetReferralsByReferrerId = {
    params: joi_1.default.object().keys({
        referrerId: joi_1.default.string().required().messages({
            'string.empty': 'Referrer ID is required',
            'any.required': 'Referrer ID is required'
        })
    })
};
exports.validateGetReferralsByRefereeId = {
    params: joi_1.default.object().keys({
        refereeId: joi_1.default.string().required().messages({
            'string.empty': 'Referee ID is required',
            'any.required': 'Referee ID is required'
        })
    })
};
exports.validateGetReferralById = {
    params: joi_1.default.object().keys({
        id: joi_1.default.string().required().messages({
            'string.empty': 'Referral ID is required',
            'any.required': 'Referral ID is required'
        })
    })
};
exports.validateUpdateReferralRewardStatus = {
    params: joi_1.default.object().keys({
        id: joi_1.default.string().required().messages({
            'string.empty': 'Referral ID is required',
            'any.required': 'Referral ID is required'
        })
    }),
    body: joi_1.default.object().keys({
        rewardStatus: joi_1.default.string().valid('PENDING', 'PAID', 'CANCELLED').required(),
        rewardAmount: joi_1.default.number().optional()
    })
};
//# sourceMappingURL=referalValidation.js.map