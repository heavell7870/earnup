import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IReferral extends Document {
    referrerId: string
    refereeId: string
    status: 'PENDING' | 'COMPLETED' | 'EXPIRED'
    referralCode: string
    referralDate: Date
    completionDate?: Date
    rewardStatus: 'PENDING' | 'PAID' | 'FAILED'
    rewardAmount?: number
}

const referralSchema: Schema<IReferral> = new Schema(
    {
        referrerId: {
            type: String,
            required: true,
            ref: 'users'
        },
        refereeId: {
            type: String,
            required: true,
            ref: 'users'
        },
        status: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'EXPIRED'],
            default: 'PENDING'
        },
        referralCode: {
            type: String,
            required: true,
            unique: true
        },
        referralDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        completionDate: {
            type: Date
        },
        rewardStatus: {
            type: String,
            enum: ['PENDING', 'PAID', 'FAILED'],
            default: 'PENDING'
        },
        rewardAmount: {
            type: Number
        }
    },
    { timestamps: true }
)

// Create a compound unique index on referrerId and refereeId
referralSchema.index({ referrerId: 1, refereeId: 1 }, { unique: true })

const ReferralModel: Model<IReferral> = mongoose.model<IReferral>('referrals', referralSchema, 'referrals')

export default ReferralModel

