import { UserRepository } from '../repositories/userReposiroty'
import * as admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { join } from 'path'
import { IUser } from '../models/userModel'
import { AppError } from '../utils/hanlders/appError'
import { StatusCodes } from 'http-status-codes'
import { ReferralService } from '../services/referalService'
import axios from 'axios'

const FIREBASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCYmAlIqVcRp--ssi5ZIIGId7-jdm_4lHY'
const serviceAccount = JSON.parse(readFileSync(join(__dirname, '../configs/firebase-service-account.json'), 'utf8'))
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
})

export class UserService {
    private repository: UserRepository
    private referralService: ReferralService

    constructor() {
        this.repository = new UserRepository()
        this.referralService = new ReferralService()
    }

    async createUserProfile(userData: Partial<IUser & { referralCode?: string }>): Promise<IUser> {
        // Check if user exists in Firebase Auth
        try {
            const user = await app.auth().getUser(userData.firebaseId!)
            if (!user) {
                throw new AppError(StatusCodes.BAD_REQUEST, 'User does not exist in Firebase Auth')
            }
            // Check if user already exists in database
            const existingUser = await this.repository.getOne({ firebaseId: userData.firebaseId })
            if (existingUser) {
                throw new AppError(StatusCodes.BAD_REQUEST, 'User already exists')
            }

            // Create new user profile
            const newUser = await this.repository.create({ ...userData, email: user.email })

            // Handle referral if referral code is present
            if (userData.referralCode) {
                const referral = await this.referralService.getReferralByCode(userData.referralCode)
                if (referral && referral.status === 'PENDING') {
                    // Update referral status to completed
                    await this.referralService.updateReferralStatus(referral._id as string, {
                        status: 'COMPLETED',
                        rewardStatus: 'PAID',
                        rewardAmount: 1000
                    })

                    // Update referrer's coins
                    const referrer = await this.repository.getById(referral.referrerId)
                    if (referrer) {
                        await this.repository.updateById(referrer._id as string, {
                            $inc: { coins: 1000 }
                        })
                    }
                }
            }

            return newUser
        } catch (error) {
            throw new AppError(StatusCodes.BAD_REQUEST, JSON.stringify(error))
        }
    }

    async updateUserProfile(firebaseId: string, updateData: Partial<IUser>): Promise<IUser | null> {
        // Find and update user profile
        const updatedUser = await this.repository.updateById(firebaseId, updateData)
        return updatedUser
    }

    async getUserByFirebaseId(firebaseId: string): Promise<IUser | null> {
        // Find user by firebaseId
        const user = await this.repository.getOne({ firebaseId })
        return user
    }

    async checkUserNameExists(userName: string): Promise<boolean> {
        const user = await this.repository.getOne({ userName })
        return !!user
    }

    async getUserById(id: string): Promise<IUser | null> {
        // Find user by firebaseId
        const user = await this.repository.getById(id)
        return user
    }

    async loginWithEmailPassword(email: string, password: string): Promise<any> {
        const user = await this.repository.getOne({ email })
        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, 'User does not exist')
        }
        const response = await axios.post(
            FIREBASE_AUTH_URL,
            {
                email,
                password,
                returnSecureToken: true // Request both idToken and refreshToken
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        const data = response.data

        // Check if there was an error in the response from Firebase
        if (data.error) {
            throw new AppError(StatusCodes.BAD_REQUEST, data.error.message)
        }

        // Firebase returns both accessToken (idToken) and refreshToken
        const { idToken, refreshToken, localId } = data

        // Send back the tokens to the client
        return {
            accessToken: idToken, // This is the Firebase ID token (JWT)
            refreshToken: refreshToken, // Firebase refresh token
            id: localId
        }
    }
}

