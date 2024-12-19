import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IBankAccount extends Document {
    userId: string
    accountHolderName: string
    accountNumber: string // Will store hashed value
    ifscCode: string // Will store hashed value
    bankName: string
    accountType: 'SAVINGS' | 'CURRENT'
    isVerified: boolean
    isDeleted: boolean
}

const bankAccountSchema: Schema<IBankAccount> = new Schema(
    {
        userId: {
            type: String,
            required: true,
            ref: 'users'
        },
        accountHolderName: {
            type: String,
            required: true,
            trim: true
        },
        accountNumber: {
            type: String,
            required: true,
            unique: true
        },
        ifscCode: {
            type: String,
            required: true,
            trim: true
        },
        bankName: {
            type: String,
            required: true,
            trim: true
        },
        accountType: {
            type: String,
            enum: ['SAVINGS', 'CURRENT'],
            default: 'SAVINGS'
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

// Create a compound index on userId and accountNumber
bankAccountSchema.index({ userId: 1, accountNumber: 1 }, { unique: true })

const BankAccountModel: Model<IBankAccount> = mongoose.model<IBankAccount>('bankAccounts', bankAccountSchema, 'bankAccounts')

export default BankAccountModel

