import Joi from 'joi'
import { objectId } from '../custom/customValidation.js'

export const loginSchema = {
    body: Joi.object().keys({
        mobile: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required()
    })
}

export const validateOtpSchema = {
    mobile: Joi.object().keys({
        phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
        otp: Joi.string().pattern(new RegExp('^[0-9]{6}$')).required()
    })
}

export const adminUserSchema = {
    query: Joi.object().keys({
        user_id: Joi.string().optional().custom(objectId)
    })
}

export const getAllUserSchema = {
    query: Joi.object().keys({
        page: Joi.number(),
        page_size: Joi.number(),
        search: Joi.string()
    })
}

export const deleteUserSchema = {
    params: Joi.object().keys({
        user_id: Joi.string().optional().custom(objectId)
    })
}

export const verifyEmailSchema = {
    params: Joi.object().keys({
        token: Joi.string().optional().custom(objectId)
    })
}

export const accessTokens = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
        accessToken: Joi.string().required()
    })
}
export const updateUserSchema = {
    query: Joi.object().keys({
        user_id: Joi.string().optional().custom(objectId)
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            email: Joi.string().email(),
            avatar: Joi.string(),
            isActive: Joi.boolean(),
            role: Joi.string(),
            isEmailVerified: Joi.boolean()
        })
        .min(1)
}

export const logoutSchema = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
        accessToken: Joi.string().required()
    })
}
