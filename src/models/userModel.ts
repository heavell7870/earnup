import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IUser extends Document {
    avatar?: string
    profileType: 'PRIVATE' | 'PUBLIC'
    fullName: string
    phone?: number
    userName: string
    email?: string
    role: 'USER' | 'ADMIN'
}

const userSchema: Schema<IUser> = new Schema(
    {
        avatar: {
            type: String
        },
        profileType: {
            type: String,
            enum: ['PRIVATE', 'PUBLIC'],
            default: 'PUBLIC'
        },
        fullName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            trim: true
        },
        userName: {
            type: String,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true
        },
        role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: 'USER'
        }
    },
    { timestamps: true }
)

const UserModel: Model<IUser> = mongoose.model<IUser>('users', userSchema, 'users')

export default UserModel

