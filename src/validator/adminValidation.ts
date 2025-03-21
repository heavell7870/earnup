import Joi from 'joi'

export const validateGetEarningsGrowth = {
    query: Joi.object().keys({
        startDate: Joi.string().optional(),
        endDate: Joi.string().optional(),
        userId: Joi.string().optional()
    })
}

export const validateGetWeeklyActiveUsers = {
    query: Joi.object().keys({
        startDate: Joi.string().optional(),
        endDate: Joi.string().optional()
    })
}

export const validateGetWeeklyAdWatchedStats = {
    query: Joi.object().keys({
        startDate: Joi.string().optional(),
        endDate: Joi.string().optional()
    })
}

export const validateGetUserList = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).optional(),
        limit: Joi.number().integer().min(1).optional(),
        fullName: Joi.string().optional(),
        email: Joi.string().optional(),
        userName: Joi.string().optional(),
        role: Joi.string().valid('USER', 'ADMIN').optional()
    })
}

export const validateGetUserData = {
    params: Joi.object().keys({
        userId: Joi.string().required()
    })
}

