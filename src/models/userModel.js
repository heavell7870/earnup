import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    avatar: {
        type:String
    },
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: Number,
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["user","admin","member"],
        default: "user"
    },
    password: {
        type: String
    },
    loginType: {
        type: String,
        enum: ["GOOGLE","EMAIL_PASSWORD","OTP_BASED"],
        default: "OTP_BASED",
    },
    verificationOTP:{
        type: String
    },
    verificationOTPExpiry: {
        type: Date,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    forgotPasswordOTP: {
        type: String,
    },
    forgotPasswordExpiry: {
        type: Date,
    },
    emailVerificationOTP: {
        type: String,
    },
    emailVerificationExpiry: {
        type: Date,
    },
    lastLogin: {
        type: Date,
    },
    isActive:{
        type:Boolean,
        default:false
    }
}, { timestamps: true })

export default mongoose.model('users', schema, 'users')