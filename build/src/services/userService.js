"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const userReposiroty_1 = require("../repositories/userReposiroty");
const admin = __importStar(require("firebase-admin"));
const fs_1 = require("fs");
const path_1 = require("path");
const appError_1 = require("../utils/hanlders/appError");
const http_status_codes_1 = require("http-status-codes");
const referalService_1 = require("../services/referalService");
const axios_1 = __importDefault(require("axios"));
const FIREBASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCYmAlIqVcRp--ssi5ZIIGId7-jdm_4lHY';
const serviceAccount = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../configs/firebase-service-account.json'), 'utf8'));
console.log(serviceAccount);
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
class UserService {
    constructor() {
        this.repository = new userReposiroty_1.UserRepository();
        this.referralService = new referalService_1.ReferralService();
    }
    async createUserProfile(userData) {
        // Check if user exists in Firebase Auth
        try {
            const user = await app.auth().getUser(userData.firebaseId);
            if (!user) {
                throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User does not exist in Firebase Auth');
            }
            // Check if user already exists in database
            const existingUser = await this.repository.getOne({ firebaseId: userData.firebaseId });
            if (existingUser) {
                throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User already exists');
            }
            // Create new user profile
            const newUser = await this.repository.create({ ...userData, email: user.email });
            // Handle referral if referral code is present
            if (userData.referralCode) {
                const referral = await this.referralService.getReferralByCode(userData.referralCode);
                if (referral && referral.status === 'PENDING') {
                    // Update referral status to completed
                    await this.referralService.updateReferralStatus(referral._id, {
                        status: 'COMPLETED',
                        rewardStatus: 'PAID',
                        rewardAmount: 1000
                    });
                    // Update referrer's coins
                    const referrer = await this.repository.getById(referral.referrerId);
                    if (referrer) {
                        await this.repository.updateById(referrer._id, {
                            $inc: { coins: 1000 }
                        });
                    }
                }
            }
            return newUser;
        }
        catch (error) {
            console.log(error);
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User does not exist in Firebase Auth');
        }
    }
    async updateUserProfile(firebaseId, updateData) {
        // Find and update user profile
        const updatedUser = await this.repository.updateById(firebaseId, updateData);
        return updatedUser;
    }
    async getUserByFirebaseId(firebaseId) {
        // Find user by firebaseId
        const user = await this.repository.getOne({ firebaseId });
        return user;
    }
    async checkUserNameExists(userName) {
        const user = await this.repository.getOne({ userName });
        return !!user;
    }
    async getUserById(id) {
        // Find user by firebaseId
        const user = await this.repository.getById(id);
        return user;
    }
    async loginWithEmailPassword(email, password) {
        const user = await this.repository.getOne({ email });
        if (!user) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, 'User does not exist');
        }
        const response = await axios_1.default.post(FIREBASE_AUTH_URL, {
            email,
            password,
            returnSecureToken: true // Request both idToken and refreshToken
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = response.data;
        // Check if there was an error in the response from Firebase
        if (data.error) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, data.error.message);
        }
        // Firebase returns both accessToken (idToken) and refreshToken
        const { idToken, refreshToken, localId } = data;
        // Send back the tokens to the client
        return {
            accessToken: idToken, // This is the Firebase ID token (JWT)
            refreshToken: refreshToken, // Firebase refresh token
            id: localId
        };
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map