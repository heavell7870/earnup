import mongoose from "mongoose";

const schema = new mongoose.Schema({
    'accessToken': {
        type: String,
        required: true
    },
    'refreshToken': {
        type: String,
        required: true
    },
    createdAt:{ type: Date, expires: 60, default: Date.now }
})
schema.index({createdAt: 1},{expireAfterSeconds: 60});
export default mongoose.model('userBlackListedTokens', schema, 'userBlackListedTokens')