"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetUserById = exports.validateCheckUserNameExists = exports.validateGetUserByFirebaseId = exports.validateUpdateUserProfile = exports.validateCreateUserProfile = void 0;
const joi_1 = __importDefault(require("joi"));
// User validation schemas
exports.validateCreateUserProfile = {
    body: joi_1.default.object().keys({
        avatar: joi_1.default.string().optional(),
        profileType: joi_1.default.string().valid('PRIVATE', 'PUBLIC').default('PUBLIC'),
        fullName: joi_1.default.string().required().messages({
            'string.empty': 'Full name is required',
            'any.required': 'Full name is required'
        }),
        phone: joi_1.default.string().optional(),
        userName: joi_1.default.string().required().messages({
            'string.empty': 'Username is required',
            'any.required': 'Username is required'
        }),
        role: joi_1.default.string().valid('USER', 'ADMIN').default('USER'),
        firebaseId: joi_1.default.string().required().messages({
            'string.empty': 'Firebase ID is required',
            'any.required': 'Firebase ID is required'
        }),
        referralCode: joi_1.default.string().optional()
    })
};
exports.validateUpdateUserProfile = {
    params: joi_1.default.object().keys({
        id: joi_1.default.string().required().messages({
            'string.empty': 'Firebase ID is required',
            'any.required': 'Firebase ID is required'
        })
    }),
    body: joi_1.default.object().keys({
        avatar: joi_1.default.string().optional(),
        profileType: joi_1.default.string().valid('PRIVATE', 'PUBLIC').optional(),
        fullName: joi_1.default.string().optional(),
        userName: joi_1.default.string().optional()
    })
};
exports.validateGetUserByFirebaseId = {
    params: joi_1.default.object().keys({
        firebaseId: joi_1.default.string().required().messages({
            'string.empty': 'Firebase ID is required',
            'any.required': 'Firebase ID is required'
        })
    })
};
exports.validateCheckUserNameExists = {
    params: joi_1.default.object().keys({
        userName: joi_1.default.string().required().messages({
            'string.empty': 'Username is required',
            'any.required': 'Username is required'
        })
    })
};
exports.validateGetUserById = {
    params: joi_1.default.object().keys({
        id: joi_1.default.string().required().messages({
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        })
    })
};
//# sourceMappingURL=userValidation.js.map