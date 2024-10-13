import Joi from "joi";
import { AppError } from "../utils/hanlders/appError.js";
import { StatusCodes } from "http-status-codes";

const pick = (object, keys) =>
    keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {});

export const validate = (schema) =>
    (req, res, next) => {
        const validSchema = pick(schema, ['params', 'query', 'body']);
        const object = pick(req, Object.keys(validSchema));
        const { value, error } = Joi.compile(validSchema)
            .prefs({ errors: { label: 'key' } })
            .validate(object);

        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ');
            return next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage));
        }
        Object.assign(req, value);
        return next();
    };