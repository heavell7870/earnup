import { EarningRepository } from '../repositories/earningReposiroty'
import { AppError } from '../utils/hanlders/appError'
import { StatusCodes } from 'http-status-codes'
import { UserRepository } from '../repositories/userReposiroty'
import { AdWatchedRepository } from '../repositories/adWatchedReposiroty'
import mongoose from 'mongoose'

export class AdminService {
    private earningRepository: EarningRepository
    private userRepository: UserRepository
    private adWatchedRepository: AdWatchedRepository

    constructor() {
        this.earningRepository = new EarningRepository()
        this.userRepository = new UserRepository()
        this.adWatchedRepository = new AdWatchedRepository()
    }

    async getEarningsGrowth(userId?: string, startDate?: Date, endDate?: Date): Promise<any> {
        try {
            const earningsGrowth = await this.earningRepository.getEarningsGrowth(userId, startDate, endDate)
            return earningsGrowth
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    async getWeeklyActiveUsers(startDate: Date, endDate: Date): Promise<any> {
        try {
            const weeklyActiveUsers = await this.userRepository.getWeeklyActiveUsers(startDate, endDate)
            return weeklyActiveUsers
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    async getWeeklyAdWatchedStats(startDate: Date, endDate: Date): Promise<any> {
        try {
            const weeklyAdWatchedStats = await this.adWatchedRepository.getWeeklyAdWatchedStats(startDate, endDate)
            return weeklyAdWatchedStats
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    async getUserList(filter: any, pagination?: { page?: number; limit?: number }, sort?: { [key: string]: 1 | -1 }): Promise<any> {
        try {
            const page = pagination?.page || 1
            const limit = pagination?.limit || 10
            const skip = (page - 1) * limit

            const pipeline = [
                { $match: filter || {} },
                {
                    $lookup: {
                        from: 'referrals',
                        localField: '_id',
                        foreignField: 'referrerId',
                        as: 'referralsCreated'
                    }
                },
                {
                    $lookup: {
                        from: 'referrals',
                        localField: '_id',
                        foreignField: 'refereeId',
                        as: 'referredBy'
                    }
                },
                {
                    $sort: sort || { createdAt: -1 }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                },
                {
                    $project: {
                        _id: 1,
                        avatar: 1,
                        profileType: 1,
                        fullName: 1,
                        phone: 1,
                        userName: 1,
                        email: 1,
                        role: 1,
                        firebaseId: 1,
                        coins: 1,
                        referralCode: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        referralsCreated: 1,
                        referredBy: 1
                    }
                }
            ]

            const userList = await this.userRepository.aggregate(pipeline)
            return userList
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    async getUserData(userId: string): Promise<any> {
        try {
            const pipeline = [
                {
                    $match: { _id: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: 'earnings',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'earnings'
                    }
                },
                {
                    $lookup: {
                        from: 'adWatched',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'adsWatched'
                    }
                },
                {
                    $lookup: {
                        from: 'referrals',
                        localField: '_id',
                        foreignField: 'referrerId',
                        as: 'referrals'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        fullName: 1,
                        email: 1,
                        createdAt: 1,
                        totalEarnings: { $sum: '$earnings.amount' },
                        adEarnings: {
                            $sum: {
                                $filter: {
                                    input: '$earnings',
                                    as: 'earning',
                                    cond: { $eq: ['$$earning.source', 'AD_WATCH'] }
                                }
                            }
                        },
                        referralEarnings: {
                            $sum: {
                                $filter: {
                                    input: '$earnings',
                                    as: 'earning',
                                    cond: { $eq: ['$$earning.source', 'REFERRAL'] }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        fullName: 1,
                        email: 1,
                        memberSince: { $dateToString: { format: '%d/%m/%Y', date: '$createdAt' } },
                        totalEarnings: { $ifNull: ['$totalEarnings', 0] },
                        adEarnings: { $ifNull: ['$adEarnings', 0] },
                        referralEarnings: { $ifNull: ['$referralEarnings', 0] }
                    }
                }
            ]

            const userData = await this.userRepository.aggregate(pipeline)
            return userData[0] || null
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }
}

