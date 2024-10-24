import Joi from 'joi';
import { objectId } from '../custom/customValidation.js';

export const addToCartSchema = {
    body: Joi.object().keys(
        {
            productId: Joi.string().required().custom(objectId),
            varientId: Joi.string().required().custom(objectId),
            quantity: Joi.number().required()
        }
    ),
};

export const updateCartSchema = {
    params: Joi.object().keys({
        cartId: Joi.string().required().custom(objectId),
    })
};

export const getCartSchema = {
    params: Joi.object().keys({
        storeId: Joi.string().required().custom(objectId),
        couponId: Joi.string().optional().custom(objectId),
    })
};

