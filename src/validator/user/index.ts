import Joi from 'joi'

// User validation schemas
export const validateLoginWithFacebook = {
    body: Joi.object().keys({
        token: Joi.string().required().messages({
            'string.empty': 'Token is required',
            'any.required': 'Token is required'
        })
    })
}

export const validateLoginWithGoogle = {
    body: Joi.object().keys({
        token: Joi.string().required().messages({
            'string.empty': 'Token is required',
            'any.required': 'Token is required'
        })
    })
}

export const validateLoginWithEmailPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required().messages({
            'string.email': 'Valid email is required',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
    })
}
export const validateSignUpWithEmailPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        fullName: Joi.string().required(),
        phone: Joi.string().required(),
        userName: Joi.string().required()
    })
}

export const validateRefreshToken = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required().messages({
            'string.empty': 'Refresh token is required',
            'any.required': 'Refresh token is required'
        })
    })
}

export const validateChangePassword = {
    body: Joi.object().keys({
        userId: Joi.string().required().messages({
            'string.empty': 'User ID is required',
            'any.required': 'User ID is required'
        }),
        newPassword: Joi.string().min(6).required().messages({
            'string.min': 'New password must be at least 6 characters long',
            'string.empty': 'New password is required',
            'any.required': 'New password is required'
        })
    })
}

