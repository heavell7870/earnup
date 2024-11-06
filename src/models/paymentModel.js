import mongoose from 'mongoose'

const schema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        orderDetails: { type: Array },
        deliveryAddress: { type: Object },
        paymentTime: { type: Date, default: null },
        couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'coupons' },
        paymentAmount: { type: Number },
        orderId: { type: String, default: null },
        paymentId: { type: String, default: null },
        razorpaySignatureId: { type: String, default: null },
        paymentMode: { type: String, enum: ['razorpay', 'paypal', 'ccavenue'] },
        paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
        invoiceNo: { type: String, required: false }
    },
    { timestamps: true }
)

export default mongoose.model('payments', schema, 'payments')
