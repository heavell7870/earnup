import Joi, { ObjectSchema } from 'joi'
import { AppError } from '../utils/hanlders/appError'
import { StatusCodes } from 'http-status-codes'
import { Request, Response, NextFunction } from 'express'

const pick = <T, K extends keyof T>(object: T, keys: K[]): Pick<T, K> =>
    keys.reduce(
        (obj, key) => {
            if (object && Object.prototype.hasOwnProperty.call(object, key)) {
                obj[key] = object[key]
            }
            return obj
        },
        {} as Pick<T, K>
    )
export const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ['params', 'query', 'body'] as any)
    const object = pick(req, Object.keys(validSchema) as Array<keyof Request>)
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object)

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ')
        return next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage))
    }
    Object.assign(req, value)
    return next()
}

