import mongoose, { Document, Schema, Model, ObjectId } from 'mongoose'

export interface IAdWatched extends Document {
    userId: ObjectId
    adId: string
    watchedAt: Date
    duration: number // in seconds
    completed: boolean
    rewardAmount: number
    deviceInfo?: {
        deviceId: string
        deviceType: string
        ipAddress: string
    }
}

const adWatchedSchema: Schema<IAdWatched> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        adId: {
            type: String,
            required: true
        },
        watchedAt: {
            type: Date,
            default: Date.now
        },
        duration: {
            type: Number,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        rewardAmount: {
            type: Number,
            required: true
        },
        deviceInfo: {
            deviceId: {
                type: String
            },
            deviceType: {
                type: String
            },
            ipAddress: {
                type: String
            }
        }
    },
    { timestamps: true }
)

// Create indexes for faster queries
adWatchedSchema.index({ userId: 1 })
adWatchedSchema.index({ adId: 1 })
adWatchedSchema.index({ watchedAt: 1 })
adWatchedSchema.index({ userId: 1, adId: 1 })

const AdWatchedModel: Model<IAdWatched> = mongoose.model<IAdWatched>('adWatched', adWatchedSchema, 'adWatched')

export default AdWatchedModel

