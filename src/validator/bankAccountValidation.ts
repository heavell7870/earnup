import Joi from 'joi'

export const validateCreateBankAccount = {
    body: Joi.object().keys({
        accountHolderName: Joi.string().required().messages({
            'string.empty': 'Account holder name is required',
            'any.required': 'Account holder name is required'
        }),
        accountNumber: Joi.string().required().messages({
            'string.empty': 'Account number is required',
            'any.required': 'Account number is required'
        }),
        ifscCode: Joi.string().required().messages({
            'string.empty': 'IFSC code is required',
            'any.required': 'IFSC code is required'
        }),
        bankName: Joi.string().required().messages({
            'string.empty': 'Bank name is required',
            'any.required': 'Bank name is required'
        }),
        accountType: Joi.string().valid('SAVINGS', 'CURRENT').default('SAVINGS')
    })
}

export const validateUpdateBankAccount = {
    params: Joi.object().keys({
        id: Joi.string().required().messages({
            'string.empty': 'Bank account ID is required',
            'any.required': 'Bank account ID is required'
        })
    }),
    body: Joi.object().keys({
        accountHolderName: Joi.string().optional(),
        accountNumber: Joi.string().optional(),
        ifscCode: Joi.string().optional(),
        bankName: Joi.string().optional(),
        accountType: Joi.string().valid('SAVINGS', 'CURRENT').optional()
    })
}

export const validateGetBankAccountById = {
    params: Joi.object().keys({
        id: Joi.string().required().messages({
            'string.empty': 'Bank account ID is required',
            'any.required': 'Bank account ID is required'
        })
    })
}

export const validateGetBankAccountsByUserId = {
    params: Joi.object().keys({
        userId: Joi.string().required().messages({
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        })
    })
}

export const validateDeleteBankAccount = {
    params: Joi.object().keys({
        id: Joi.string().required().messages({
            'string.empty': 'Bank account ID is required',
            'any.required': 'Bank account ID is required'
        })
    })
}

export const validateVerifyBankAccount = {
    params: Joi.object().keys({
        id: Joi.string().required().messages({
            'string.empty': 'Bank account ID is required',
            'any.required': 'Bank account ID is required'
        })
    })
}

