import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    pincode: {
        type: Number,
        required: true
    },
    landmark: {
        type: String
    },
    latitude:{
        type: String
    },
    longitude:{
        type: String
    },
    saveAddressAs :{
        type: String,  //save address as
        required:true
    },
    directions:{
        type: String
    },
    instructions:{
        type: String
    },
    nearestStore:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stores',
    },
    deliveryDetails:{
        type:Object
    },
    isDefault: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

export default mongoose.model('userAddresses', schema, 'userAddresses')