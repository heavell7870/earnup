import mongoose from 'mongoose'

export const objectId = (value, helpers) => {
    if (!mongoose.isValidObjectId(value)) {
        return helpers.message({ custom: '"{{#label}}" must be a valid mongo id' })
    }
    return value
}
