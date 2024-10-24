import Joi from 'joi';
import { objectId } from '../custom/customValidation.js';

export const addAddressSchema = {
    body: Joi.object().keys(
        {
            name: Joi.string().required(),
            email: Joi.string().optional().email(),
            phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')),
            address1: Joi.string().required(),
            address2: Joi.string().required(),
            pincode: Joi.number().required(),
            landmark: Joi.string().optional(),
            saveAddressAs: Joi.string().required(),
        }
    ),
};

export const updateAddressSchema = {
    params: Joi.object().keys({
        addressId: Joi.string().required().custom(objectId),
    }),
    body: Joi.object().keys(
        {
            name: Joi.string(),
            email: Joi.string().optional().email(),
            phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')),
            address1: Joi.string(),
            address2: Joi.string(),
            pincode: Joi.number(),
            saveAddressAs: Joi.string(),
            landmark: Joi.string(),
            directions: Joi.string(),
            instructions: Joi.string(),
            latitude: Joi.string(),
            longitude: Joi.string(),
            country: Joi.string(),
            state: Joi.string(),
            city: Joi.string()
        }
    ),
};
export const deleteAddressSchema = {
    params: Joi.object().keys({
        addressId: Joi.string().required().custom(objectId),
    })
};
export const singleAddressSchema = {
    params: Joi.object().keys({
        addressId: Joi.string().required().custom(objectId),
    })
};

export const nearByAddressSchema = {
    query: Joi.object().keys({
        lat: Joi.number().required(),
        lon: Joi.number().required()
    })
};