import { CrudRepository } from './index'
import userModel, { IUser } from '../models/userModel'
import { AppError } from '../utils/hanlders/appError'
import { Model, Types } from 'mongoose'

export class UserRepository extends CrudRepository<IUser> {
    constructor() {
        super(userModel as Model<IUser, any, IUser>)
    }

    async getUserAggregation(filter: any): Promise<IUser[]> {
        try {
            const response = await this.model.aggregate(filter)
            return response as IUser[]
        } catch (error: any) {
            throw new AppError(error.statusCode || 500, error.message, error)
        }
    }

    async getWeeklyActiveUsers(
        startDate: Date,
        endDate: Date
    ): Promise<{
        dailyActiveUsers: { date: string; count: number }[]
        totalActiveUsers: number
        growth: number
    }> {
        try {
            // Get daily active users for each day in the week
            const dailyActiveUsers = await this.model.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            day: { $dayOfMonth: '$createdAt' },
                            month: { $month: '$createdAt' },
                            year: { $year: '$createdAt' }
                        },
                        count: { $sum: 1 },
                        date: { $first: '$createdAt' }
                    }
                },
                {
                    $sort: { date: 1 }
                },
                {
                    $project: {
                        _id: 0,
                        date: {
                            $dateToString: { format: '%Y-%m-%d', date: '$date' }
                        },
                        count: 1
                    }
                }
            ])

            // Get total active users for the week
            const totalActiveUsersResult = await this.model.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ])

            const totalActiveUsers = totalActiveUsersResult.length > 0 ? totalActiveUsersResult[0].count : 0

            // Calculate previous period dates
            const previousEndDate = new Date(startDate)
            previousEndDate.setDate(previousEndDate.getDate() - 1)

            const previousStartDate = new Date(previousEndDate)
            previousStartDate.setDate(previousStartDate.getDate() - 7)

            // Get previous period total active users
            const previousPeriodResult = await this.model.aggregate([
                {
                    $match: {
                        createdAt: { $gte: previousStartDate, $lte: previousEndDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ])

            const previousPeriodUsers = previousPeriodResult.length > 0 ? previousPeriodResult[0].count : 0

            // Calculate growth percentage
            let growth = 0
            if (previousPeriodUsers > 0) {
                growth = ((totalActiveUsers - previousPeriodUsers) / previousPeriodUsers) * 100
            } else if (totalActiveUsers > 0) {
                growth = 100 // If there were no users in the previous period, growth is 100%
            }

            return {
                dailyActiveUsers,
                totalActiveUsers,
                growth
            }

            /* Example returned data:
            {
                "dailyActiveUsers": [
                    { "date": "2023-05-01", "count": 12 },
                    { "date": "2023-05-02", "count": 15 },
                    { "date": "2023-05-03", "count": 8 },
                    { "date": "2023-05-04", "count": 20 },
                    { "date": "2023-05-05", "count": 25 },
                    { "date": "2023-05-06", "count": 18 },
                    { "date": "2023-05-07", "count": 10 }
                ],
                "totalActiveUsers": 108,
                "growth": 25.58 // Represents a 25.58% increase from the previous 7-day period
            }
            */
        } catch (error: any) {
            throw new AppError(error.statusCode || 500, error.message, error)
        }
    }
}

