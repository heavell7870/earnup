import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
    },
    varientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'varients',
    }
}, { timestamps: true })

export default mongoose.model('wishlists', schema, 'wishlists')