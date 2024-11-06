import mongoose from 'mongoose'

const schema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'stores', required: true },
        paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'payments', required: true },
        products: { type: Object },
        deliveryAddress: { type: Object },
        paymentDetails: { type: Object },
        isCod: { type: Boolean, default: false },
        isPaid: { type: Boolean, default: false },
        isApproved: { type: Boolean, default: false },
        isPacked: { type: Boolean, default: false },
        isAssignedToPartner: { type: Boolean, default: false },
        isDelivered: { type: Boolean, default: false },
        isCancelled: { type: Boolean, default: false },
        isReturn: { type: Boolean, default: false },
        isRefund: { type: Boolean, default: false },
        isExchange: { type: Boolean, default: false },
        orderProgressList: { type: Array, default: [] }
    }, { timestamps: true })

export default mongoose.model('orders', schema, 'orders')
