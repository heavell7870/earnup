import { UserRepository } from '../repositories/userReposiroty.js'
import { Helper } from '../utils/helper/index.js'
import { AppError } from '../utils/hanlders/appError.js' // Assuming you have an AppError class
import { StatusCodes } from 'http-status-codes' // Assuming you're using http-status-codes for status code references
import configs from '../configs/index.js'
import { sendEmailVerificationLink } from '../utils/emailNotifications/index.js'
import blackListedToken from '../models/blackListedToken.js'
import moment from 'moment'
import mongoose from 'mongoose'

export class UserService {
    constructor() {
        this.repository = new UserRepository()
    }
    async sentOtpOnLogin(data) {
        try {
            // Check if user exists based on mobile number
            let user = await this.repository.getOne({ phone: data.mobile })
            // Generate OTP and expiration time
            const { otp, expiresAt } = Helper.generateOTP()

            // If the user does not exist, create a new user with OTP data
            if (!user) {
                data.phone = data.mobile
                data.verificationOTP = otp
                data.verificationOTPExpiry = expiresAt
                user = await this.repository.create(data)
            } else {
                // Update existing user with new OTP data
                user.verificationOTP = otp
                user.verificationOTPExpiry = expiresAt
                await user.save() // Save only when updating existing user
            }
            if (configs.NODE_ENV != 'development') {
                // Send OTP via SMS
                await Helper.sentOTPThroughSMS(otp, user.phone)
            }
            // Return the user (either newly created or updated)
            return user
        } catch (error) {
            // Handle errors and wrap them in a custom AppError for proper logging and response
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async validateAndGenerateToken(data) {
        try {
            // Check if user exists based on mobile number
            let user = await this.repository.getOne({ phone: data.mobile })
            if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'user not found')
            // Check if the OTP matches
            if (user?.verificationOTP != data?.otp) {
                throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid OTP')
            }
            // Check if the OTP has expired
            const currentTime = moment()
            const otpExpiryTime = moment(user.verificationOTPExpiry)

            if (currentTime.isAfter(otpExpiryTime)) {
                throw new AppError(StatusCodes.UNAUTHORIZED, 'OTP has expired')
            }

            // OTP is valid, mark user as verified
            user.isActive = true
            user.verificationOTP = null // Clear OTP after successful validation
            user.verificationOTPExpiry = null // Clear expiry time
            user.lastLogin = new Date()
            await user.save()
            let generateToken = await Helper.generateAccessAndRefreshTokens(user)
            return { ...generateToken, name: user.name, avtar: user?.avtar, phone: user.phone, user_id: user._id }
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async getAllUserListAdmin(query) {
        try {
            const user = await this.repository.getUserAggregation(query)
            return user
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async fetchCurrentUser(id) {
        try {
            const user = await this.repository.getUserAggregation([
                {
                    $match: { _id: new mongoose.Types.ObjectId(id) }
                },
                {
                    $lookup: {
                        from: 'userAddresses',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'userAddresses'
                    }
                },
                {
                    $lookup: {
                        from: 'wishlists',
                        let: {
                            userId: '$_id'
                        },
                        pipeline: [
                            {
                                $match: { $expr: { $eq: ['$userId', '$$userId'] } }
                            },
                            {
                                $lookup: {
                                    from: 'products', // Name of the product collection
                                    localField: 'productId',
                                    foreignField: '_id',
                                    as: 'productDetails'
                                }
                            },
                            {
                                $lookup: {
                                    from: 'varients', // Name of the variant collection
                                    localField: 'varientId',
                                    foreignField: '_id',
                                    as: 'varientDetails'
                                }
                            },
                            {
                                $unwind: '$productDetails' // Deconstruct product array
                            },
                            {
                                $unwind: '$varientDetails' // Deconstruct variant array
                            },
                            {
                                // Project only the necessary fields, and calculate totals based on quantity
                                $project: {
                                    _id: 1, // Cart ID
                                    quantity: 1,
                                    productDetails: {
                                        _id: 1,
                                        thumbnail: 1,
                                        name: 1
                                    },
                                    varientDetails: {
                                        unit: 1,
                                        weight: 1,
                                        mrp: 1,
                                        sellingPrice: 1
                                    }
                                }
                            }
                        ],
                        as: 'wishlists'
                    }
                },
                {
                    $lookup: {
                        from: 'carts',
                        let: {
                            userId: '$_id'
                        },
                        pipeline: [
                            {
                                $match: { $expr: { $eq: ['$userId', '$$userId'] } }
                            },
                            {
                                $lookup: {
                                    from: 'products', // Name of the product collection
                                    localField: 'productId',
                                    foreignField: '_id',
                                    as: 'productDetails'
                                }
                            },
                            {
                                $lookup: {
                                    from: 'varients', // Name of the variant collection
                                    localField: 'varientId',
                                    foreignField: '_id',
                                    as: 'varientDetails'
                                }
                            },
                            {
                                $unwind: '$productDetails' // Deconstruct product array
                            },
                            {
                                $unwind: '$varientDetails' // Deconstruct variant array
                            },
                            {
                                // Project only the necessary fields, and calculate totals based on quantity
                                $project: {
                                    _id: 1, // Cart ID
                                    quantity: 1,
                                    productDetails: {
                                        _id: 1,
                                        thumbnail: 1,
                                        name: 1
                                    },
                                    varientDetails: {
                                        unit: 1,
                                        weight: 1,
                                        mrp: 1,
                                        sellingPrice: 1
                                    }
                                }
                            }
                        ],
                        as: 'carts'
                    }
                },
                {
                    $lookup: {
                        from: 'orders',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'orders'
                    }
                },
                {
                    $lookup: {
                        from: 'payments',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'payments'
                    }
                }
            ])
            if (!user.length) throw new AppError(StatusCodes.NOT_FOUND, 'user not found')
            return user
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async deleteUserAdmin(id) {
        try {
            const user = await this.repository.getById(id)
            if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'user not found')
            const deleteUserById = await this.repository.deleteById(id)
            if (!deleteUserById) throw new AppError(StatusCodes.BAD_REQUEST, 'error while delete user')
            return deleteUserById
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async updateUser(id, updatedData) {
        try {
            if (updatedData.phone) {
                throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'phone number is not editable')
            }
            if (updatedData.email) updatedData.isEmailVerified = false
            const user = await this.repository.getById(id)
            if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'user not found')
            const updateUserById = await this.repository.updateById(id, updatedData)
            if (!updateUserById) throw new AppError(StatusCodes.BAD_REQUEST, 'error while update user')
            return updateUserById
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async generateAccessTokenFromRefresh(accessToken, refreshToken) {
        try {
            const decodedAccessToken = await Helper.decodeAccessToken(accessToken)
            const decodedRefreshToken = await Helper.decodeRefreshToken(refreshToken)
            // Generate a new access token
            if (!decodedAccessToken && decodedRefreshToken) {
                const user = await this.repository.getById(decodedRefreshToken.user)
                if (!user) throw new Error(StatusCodes.NOT_FOUND, 'User not found')
                const accessToken = await Helper.generateAccessToken(user)
                return accessToken
            }
            throw new AppError(StatusCodes.UNAUTHORIZED, 'session expired!! please login')
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async sentVerificationEmail(userId) {
        let userExist = await this.repository.getById(userId)
        if (!userExist) throw new AppError(StatusCodes.NOT_FOUND, 'user not found')
        if (!userExist.email) throw new AppError(StatusCodes.NOT_FOUND, 'email not found')
        if (userExist.isEmailVerified) throw new AppError(StatusCodes.BAD_REQUEST, 'email alresdy verified')
        let token = await Helper.generateEmailVerificationToken(userExist._id)
        return await sendEmailVerificationLink(userExist.email, token)
    }
    async verifyEmailLink(token) {
        let decodeToken = await Helper.decodeEmailVerificationToken(token)
        if (!decodeToken) throw new AppError(StatusCodes.BAD_REQUEST, 'Verification Failed')
        let userExist = await this.repository.getById(decodeToken.id)
        if (!userExist) throw new AppError(StatusCodes.NOT_FOUND, 'user not found')
        userExist.isEmailVerified = true
        await userExist.save()
        return userExist
    }
    async logoutUser(accessToken, refreshToken) {
        try {
            return await blackListedToken.create({ accessToken, refreshToken })
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
}
