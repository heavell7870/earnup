import mongoose, { Document, Schema, Model, ObjectId } from 'mongoose'

export interface IEarning extends Document {
    userId: ObjectId
    amount: number
    source: 'REFERRAL' | 'AD_WATCH'
    referralId?: ObjectId
    adId?: string
    description?: string
    earnedAt: Date
    status: 'PENDING' | 'PAID'
}

const earningSchema: Schema<IEarning> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        amount: {
            type: Number,
            required: true
        },
        source: {
            type: String,
            enum: ['REFERRAL', 'AD_WATCH'],
            required: true
        },
        referralId: {
            type: Schema.Types.ObjectId,
            ref: 'referrals'
        },
        adId: {
            type: String
        },
        description: {
            type: String
        },
        earnedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['PENDING', 'PAID'],
            default: 'PENDING'
        }
    },
    { timestamps: true }
)

// Create index on userId for faster queries
earningSchema.index({ userId: 1 })
// Create compound index on userId and source
earningSchema.index({ userId: 1, source: 1 })

const EarningModel: Model<IEarning> = mongoose.model<IEarning>('earnings', earningSchema, 'earnings')

export default EarningModel

