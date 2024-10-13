import Joi from 'joi';
import { objectId } from '../custom/customValidation.js';

export const wishListSchema = {
    body: Joi.object().keys(
        {
            productId: Joi.string().required().custom(objectId),
            varientId: Joi.string().required().custom(objectId)
        }
    ),
};

