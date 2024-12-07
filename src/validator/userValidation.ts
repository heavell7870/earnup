import Joi from 'joi'

// User validation schemas
export const validateCreateUserProfile = {
    body: Joi.object().keys({
        avatar: Joi.string().optional(),
        profileType: Joi.string().valid('PRIVATE', 'PUBLIC').default('PUBLIC'),
        fullName: Joi.string().required().messages({
            'string.empty': 'Full name is required',
            'any.required': 'Full name is required'
        }),
        phone: Joi.string().optional(),
        userName: Joi.string().required().messages({
            'string.empty': 'Username is required',
            'any.required': 'Username is required'
        }),
        role: Joi.string().valid('USER', 'ADMIN').default('USER'),
        firebaseId: Joi.string().required().messages({
            'string.empty': 'Firebase ID is required',
            'any.required': 'Firebase ID is required'
        }),
        referralCode: Joi.string().optional()
    })
}

export const validateUpdateUserProfile = {
    params: Joi.object().keys({
        id: Joi.string().required().messages({
            'string.empty': 'Firebase ID is required',
            'any.required': 'Firebase ID is required'
        })
    }),
    body: Joi.object().keys({
        avatar: Joi.string().optional(),
        profileType: Joi.string().valid('PRIVATE', 'PUBLIC').optional(),
        fullName: Joi.string().optional(),
        userName: Joi.string().optional()
    })
}

export const validateGetUserByFirebaseId = {
    params: Joi.object().keys({
        firebaseId: Joi.string().required().messages({
            'string.empty': 'Firebase ID is required',
            'any.required': 'Firebase ID is required'
        })
    })
}

export const validateCheckUserNameExists = {
    params: Joi.object().keys({
        userName: Joi.string().required().messages({
            'string.empty': 'Username is required',
            'any.required': 'Username is required'
        })
    })
}

export const validateGetUserById = {
    params: Joi.object().keys({
        id: Joi.string().required().messages({
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        })
    })
}

