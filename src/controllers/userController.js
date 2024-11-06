import { UserService } from '../services/userService.js'
import { catchAsync } from '../utils/hanlders/catchAsync.js'
import { AppError } from '../utils/hanlders/appError.js'
import { ApiResponse } from '../utils/hanlders/appResponse.js'
import { StatusCodes } from 'http-status-codes'
import configs from '../configs/index.js'

export class UserController {
    constructor() {
        this.service = new UserService()
    }
    login = catchAsync(async (req, res) => {
        //validate data
        let sentOTP = await this.service.sentOtpOnLogin(req.body)
        if (!sentOTP) throw new AppError(StatusCodes.BAD_REQUEST, 'Error while sending OTP')
        return res
            .status(StatusCodes.OK)
            .send(new ApiResponse(StatusCodes.OK, configs.NODE_ENV == 'development' ? { otp: sentOTP.verificationOTP } : null, 'OTP sent successful'))
    })
    validateOTP = catchAsync(async (req, res) => {
        let verifyUser = await this.service.validateAndGenerateToken(req.body)
        if (!verifyUser) throw new AppError(StatusCodes.BAD_REQUEST, 'Error while validate OTP')
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, verifyUser, 'Token Generation successful'))
    })
    getCurrentUser = catchAsync(async (req, res) => {
        if (req?.roleId && !req.query.user_id) throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid requeest')
        if (req?.roleId) var id = req.query.user_id
        else if (req?.user) var id = req.user
        else throw new AppError(StatusCodes.UNAUTHORIZED, 'Access Denied')
        let user = await this.service.fetchCurrentUser(id)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, user, 'User details fetched sucessfully'))
    })
    getAllUser = catchAsync(async (req, res) => {
        let pipeline = [
            {
                $sort: { createdAt: -1 }
            }
        ]
        let page = 1
        let page_size = 10
        if (req.query.page) {
            page = parseInt(req.query.page)
        }
        if (req.query.page_size) {
            page_size = parseInt(req.query.page_size)
        }
        // If a search query is provided, perform a search on the email or name fields
        if (req.query.search) {
            pipeline.push({
                $match: {
                    $or: [
                        { email: { $regex: '.*' + req.query.search + '.*', $options: 'i' } },
                        { name: { $regex: '.*' + req.query.search + '.*', $options: 'i' } }
                    ]
                }
            })
        }

        // Pagination
        pipeline.push({
            $facet: {
                metadata: [{ $count: 'total_records' }],
                records: [{ $skip: (page - 1) * page_size }, { $limit: page_size }]
            }
        })
        let fetchAlluser = await this.service.getAllUserListAdmin(pipeline)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, fetchAlluser, 'all user list fetched successful'))
    })
    updateUser = catchAsync(async (req, res) => {
        if (req?.roleId && !req.query.user_id) throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid requeest')
        if (req?.roleId) var id = req.query.user_id
        else if (req?.user) var id = req.user
        else throw new AppError(StatusCodes.UNAUTHORIZED, 'Access Denied')
        const updateData = req.body
        const updatedUser = await this.service.updateUser(id, updateData)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, updatedUser, 'User updated successfully'))
    })
    deleteUser = catchAsync(async (req, res) => {
        const { user_id } = req.params
        const deletedUser = await this.service.deleteUserAdmin(user_id)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.NO_CONTENT, deletedUser, 'User deleted successfully'))
    })
    sentEmailVerificationLink = catchAsync(async (req, res) => {
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, 'Token Missing in Headers')
        let sentVerificationEmail = await this.service.sentVerificationEmail(req.user)
        return res.status(StatusCodes.NO_CONTENT).send(new ApiResponse(StatusCodes.OK, sentVerificationEmail, 'Email sent successful'))
    })
    verifyEmail = catchAsync(async (req, res) => {
        const { token } = req.params
        let verify = await this.service.verifyEmailLink(token)
        if (!verify) throw new AppError(StatusCodes.BAD_REQUEST, 'Error while verify email')
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, null, 'verification successful'))
    })
    genrateAcessToken = catchAsync(async (req, res) => {
        let { accessToken, refreshToken } = req.body
        let newAccessToken = await this.service.generateAccessTokenFromRefresh(accessToken, refreshToken)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, newAccessToken, 'Access Token Generation successfully'))
    })
    logout = catchAsync(async (req, res) => {
        let { accessToken, refreshToken } = req.body
        let newAccessToken = await this.service.logoutUser(accessToken, refreshToken)
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, newAccessToken, 'Access Token Generation successfully'))
    })
}
