import mongoose from 'mongoose'

const schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        varientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'varients'
        },
        quantity: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model('carts', schema, 'carts')
