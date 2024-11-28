import mongoose from 'mongoose'
import { CustomHelpers } from 'joi'

export const objectId = (value: any, helpers: CustomHelpers): any => {
    if (!mongoose.isValidObjectId(value)) {
        return helpers.message({ custom: '"{{#label}}" must be a valid mongo id' })
    }
    return value
}

