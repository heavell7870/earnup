import { StatusCodes } from 'http-status-codes'
import { UserRepository } from '../repositories/userReposiroty'
import { AppError } from '../utils/hanlders/appError'
import * as admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { join } from 'path'
import axios from 'axios'

const FIREBASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCYmAlIqVcRp--ssi5ZIIGId7-jdm_4lHY'
const FIREBASE_SIGNUP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCYmAlIqVcRp--ssi5ZIIGId7-jdm_4lHY'
const serviceAccount = JSON.parse(readFileSync(join(__dirname, '../configs/firebase-service-account.json'), 'utf8'))

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
})

export class UserService {
    private repository: UserRepository // Declare the type for repository

    constructor() {
        this.repository = new UserRepository()
    }

    async loginWithFacebook(token: string): Promise<any> {
        // Verify the token with Facebook and return user data
        const userData = await this.verifyTokenWithFirebase(token, 'facebook')
        await this.repository.create(userData) // Save user data in UserRepository
        return userData
    }

    async loginWithGoogle(token: string): Promise<any> {
        // Verify the token with Google and return user data
        const userData = await this.verifyTokenWithFirebase(token, 'google')
        await this.repository.create(userData) // Save user data in UserRepository
        return userData
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

    async signUpWithEmailPassword(email: string, password: string, fullName: string, phone: string, userName: string): Promise<any> {
        const user = await this.repository.getOne({ email })
        if (user) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'User already exists')
        }
        const response = await axios.post(
            FIREBASE_SIGNUP_URL,
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
        await this.repository.create({ email, fullName, phone, userName })
        // Firebase returns both accessToken (idToken) and refreshToken
        const { idToken, refreshToken, localId } = data

        // Send back the tokens to the client
        return {
            accessToken: idToken, // This is the Firebase ID token (JWT)
            refreshToken: refreshToken, // Firebase refresh token
            id: localId
        }
    }

    async refreshToken(refreshToken: string): Promise<any> {
        // Use Firebase to refresh the token
        const newToken = await app.auth().verifyIdToken(refreshToken)
        return newToken
    }

    async changePassword(userId: string, newPassword: string): Promise<void> {
        // Change the user's password using Firebase
        await app.auth().updateUser(userId, { password: newPassword })
    }

    private async verifyTokenWithFirebase(token: string, provider: string): Promise<any> {
        // Verify the token with Firebase
        try {
            const decodedToken = await app.auth().verifyIdToken(token)
            return decodedToken
        } catch (error) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid token')
        }
    }
}

