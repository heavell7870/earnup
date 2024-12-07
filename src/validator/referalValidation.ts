import Joi from 'joi'

export const validateCreateReferral = {
    body: Joi.object().keys({
        refereeId: Joi.string().required().messages({
            'string.empty': 'Referee ID is required',
            'any.required': 'Referee ID is required'
        })
    })
}

export const validateUpdateReferralStatus = {
    params: Joi.object().keys({
        id: Joi.string().required().messages({
            'string.empty': 'Referral ID is required',
            'any.required': 'Referral ID is required'
        })
    }),
    body: Joi.object().keys({
        status: Joi.string().valid('PENDING', 'COMPLETED', 'CANCELLED').required(),
        rewardStatus: Joi.string().valid('PENDING', 'PAID', 'CANCELLED').optional(),
        rewardAmount: Joi.number().optional()
    })
}

export const validateGetReferralByCode = {
    params: Joi.object().keys({
        code: Joi.string().required().messages({
            'string.empty': 'Referral code is required',
            'any.required': 'Referral code is required'
        })
    })
}

export const validateGetReferralsByReferrerId = {
    params: Joi.object().keys({
        referrerId: Joi.string().required().messages({
            'string.empty': 'Referrer ID is required',
            'any.required': 'Referrer ID is required'
        })
    })
}

export const validateGetReferralsByRefereeId = {
    params: Joi.object().keys({
        refereeId: Joi.string().required().messages({
            'string.empty': 'Referee ID is required',
            'any.required': 'Referee ID is required'
        })
    })
}

export const validateGetReferralById = {
    params: Joi.object().keys({
        id: Joi.string().required().messages({
            'string.empty': 'Referral ID is required',
            'any.required': 'Referral ID is required'
        })
    })
}

export const validateUpdateReferralRewardStatus = {
    params: Joi.object().keys({
        id: Joi.string().required().messages({
            'string.empty': 'Referral ID is required',
            'any.required': 'Referral ID is required'
        })
    }),
    body: Joi.object().keys({
        rewardStatus: Joi.string().valid('PENDING', 'PAID', 'CANCELLED').required(),
        rewardAmount: Joi.number().optional()
    })
}

