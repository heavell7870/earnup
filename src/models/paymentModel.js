import mongoose from 'mongoose'

const schema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'stores', required: true },
        products: { type: Array },
        deliveryAddress: { type: Object },
        paymentTime: { type: Date, default: null },
        couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'coupons' },
        priceDetails: { type: Object,required:true },
        orderId: { type: String, default: null },
        paymentId: { type: String, default: null },
        razorpaySignatureId: { type: String, default: null },
        paymentMode: { type: String, enum: ['razorpay', 'cod', 'ccavenue'] },
        paymentStatus: { type: String, enum: ['pending', 'success', 'failed', 'canceled'], default: 'pending' },
        invoiceNo: { type: String, required: false }
    },
    { timestamps: true }
)

export default mongoose.model('payments', schema, 'payments')
