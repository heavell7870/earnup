import { UserRepository } from '../repositories/userReposiroty'
import * as admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { join } from 'path'
import { IUser } from '../models/userModel'
import { AppError } from '../utils/hanlders/appError'
import { StatusCodes } from 'http-status-codes'
import { ReferralService } from '../services/referalService'
import axios from 'axios'
import { ObjectId } from 'mongoose'
import { ReferalRepository } from '../repositories/referalReposiroty'
import { EarningRepository } from '../repositories/earningReposiroty'

const FIREBASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCYmAlIqVcRp--ssi5ZIIGId7-jdm_4lHY'
const serviceAccount = JSON.parse(readFileSync(join(__dirname, '../../firebase-service-account.json'), 'utf8'))
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
})

const generateReferralCode = async (repository: UserRepository) => {
    let referralCode
    let existingReferral
    do {
        // Generate a random 8 character alphanumeric code
        referralCode = Math.random().toString(36).substring(2, 10).toUpperCase()
        // Check if it already exists
        existingReferral = await repository.getOne({ referralCode })
    } while (existingReferral)
    return referralCode
}

export class UserService {
    private repository: UserRepository
    private referralRepository: ReferalRepository
    private earningRepository: EarningRepository

    constructor() {
        this.repository = new UserRepository()
        this.referralRepository = new ReferalRepository()
        this.earningRepository = new EarningRepository()
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
            const referralCode = await generateReferralCode(this.repository)
            // Create new user profile
            const newUser = await this.repository.create({ ...userData, email: user.email, referralCode })

            // Handle referral if referral code is present
            if (userData.referralCode) {
                const referrer = await this.repository.getOne({ referralCode: userData.referralCode })
                if (referrer) {
                    // Update referral status to completed
                    await this.referralRepository.create({
                        status: 'COMPLETED',
                        rewardStatus: 'PAID',
                        rewardAmount: 1000,
                        referralCode: userData.referralCode,
                        referrerId: referrer._id as ObjectId,
                        refereeId: newUser._id as ObjectId
                    })

                    if (referrer) {
                        await this.repository.updateById(referrer._id as string, {
                            $inc: { coins: 1000 }
                        })
                        await this.earningRepository.create({
                            userId: referrer._id as ObjectId,
                            amount: 1000,
                            source: 'REFERRAL',
                            referralId: newUser._id as ObjectId,
                            status: 'PAID'
                        })
                    }
                }
            }

            return newUser
        } catch (error) {
            console.log(error)
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

    async getUserById(id: ObjectId): Promise<IUser | null> {
        // Find user by firebaseId
        const user = await this.repository.getById(id)
        return user
    }

    async loginWithEmailPassword(email: string, password: string): Promise<any> {
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

    async checkEmailExists(email: string): Promise<boolean> {
        const user = await this.repository.getOne({ email: decodeURIComponent(email) })
        return !!user
    }
}

