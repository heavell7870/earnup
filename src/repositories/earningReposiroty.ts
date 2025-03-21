import { CrudRepository } from './index'
import { AppError } from '../utils/hanlders/appError'
import { Model } from 'mongoose'
import mongoose from 'mongoose'
import earningModel, { IEarning } from '../models/earningModel'

export class EarningRepository extends CrudRepository<IEarning> {
    constructor() {
        super(earningModel as Model<IEarning, any, IEarning>) // Adjusted type casting to match expected Model<IUser>
    }

    async getEarningsAggregation(filter: any): Promise<IEarning[]> {
        try {
            const response = await this.model.aggregate(filter)
            return response as IEarning[]
        } catch (error: any) {
            throw new AppError(error.statusCode || 500, error.message, error)
        }
    }

    async getEarningsGrowth(userId?: string, startDate?: Date, endDate?: Date): Promise<any> {
        try {
            // Set default dates if not provided (last 7 days)
            const now = new Date()
            const actualEndDate = endDate || now
            const actualStartDate = startDate || new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days ago

            // Calculate the period length in days
            const periodLengthMs = actualEndDate.getTime() - actualStartDate.getTime()
            const periodLengthDays = Math.ceil(periodLengthMs / (1000 * 60 * 60 * 24))

            // Calculate the previous period dates
            const previousEndDate = new Date(actualStartDate)
            previousEndDate.setDate(previousEndDate.getDate() - 1)

            const previousStartDate = new Date(previousEndDate)
            previousStartDate.setDate(previousStartDate.getDate() - periodLengthDays)

            // Build match condition based on whether userId is provided
            const matchCondition: any = {
                earnedAt: { $gte: actualStartDate, $lte: actualEndDate }
            }

            // Only add userId to match condition if it's provided
            if (userId) {
                matchCondition.userId = new mongoose.Types.ObjectId(userId)
            }

            // Get current period earnings
            const currentPeriodEarnings = await this.model.aggregate([
                {
                    $match: matchCondition
                },
                {
                    $group: {
                        _id: {
                            day: { $dayOfMonth: '$earnedAt' },
                            month: { $month: '$earnedAt' },
                            year: { $year: '$earnedAt' }
                        },
                        dailyTotal: { $sum: '$amount' },
                        date: { $first: '$earnedAt' }
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
                        amount: '$dailyTotal'
                    }
                }
            ])

            // Build previous period match condition
            const previousMatchCondition: any = {
                earnedAt: { $gte: previousStartDate, $lte: previousEndDate }
            }

            // Only add userId to previous match condition if it's provided
            if (userId) {
                previousMatchCondition.userId = new mongoose.Types.ObjectId(userId)
            }

            // Get previous period earnings
            const previousPeriodEarnings = await this.model.aggregate([
                {
                    $match: previousMatchCondition
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' }
                    }
                }
            ])

            // Calculate current period total
            const currentPeriodTotal = currentPeriodEarnings.reduce((sum, day) => sum + day.amount, 0)

            // Calculate previous period total
            const previousPeriodTotal = previousPeriodEarnings.length > 0 ? previousPeriodEarnings[0].totalAmount : 0

            // Calculate growth percentage
            let growthPercentage = 0
            if (previousPeriodTotal > 0) {
                growthPercentage = ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100
            } else if (currentPeriodTotal > 0) {
                growthPercentage = 100 // If previous period was 0 and current is positive, 100% growth
            }

            return {
                currentPeriodTotal,
                previousPeriodTotal,
                growthPercentage,
                growthAmount: currentPeriodTotal - previousPeriodTotal,
                currentPeriod: {
                    startDate: actualStartDate.toISOString().split('T')[0],
                    endDate: actualEndDate.toISOString().split('T')[0]
                },
                previousPeriod: {
                    startDate: previousStartDate.toISOString().split('T')[0],
                    endDate: previousEndDate.toISOString().split('T')[0]
                },
                dailyData: currentPeriodEarnings
            }

            /* Example response:
            {
                "currentPeriodTotal": 250,
                "previousPeriodTotal": 200,
                "growthPercentage": 25,
                "growthAmount": 50,
                "currentPeriod": {
                    "startDate": "2023-05-01",
                    "endDate": "2023-05-15"
                },
                "previousPeriod": {
                    "startDate": "2023-04-16",
                    "endDate": "2023-04-30"
                },
                "dailyData": [
                    { "date": "2023-05-01", "amount": 20 },
                    { "date": "2023-05-02", "amount": 15 },
                    { "date": "2023-05-03", "amount": 25 },
                    { "date": "2023-05-04", "amount": 30 },
                    { "date": "2023-05-05", "amount": 10 },
                    { "date": "2023-05-06", "amount": 0 },
                    { "date": "2023-05-07", "amount": 5 },
                    { "date": "2023-05-08", "amount": 35 },
                    { "date": "2023-05-09", "amount": 20 },
                    { "date": "2023-05-10", "amount": 15 },
                    { "date": "2023-05-11", "amount": 25 },
                    { "date": "2023-05-12", "amount": 20 },
                    { "date": "2023-05-13", "amount": 10 },
                    { "date": "2023-05-14", "amount": 15 },
                    { "date": "2023-05-15", "amount": 5 }
                ]
            }
            */
        } catch (error: any) {
            throw new AppError(error.statusCode || 500, error.message, error)
        }
    }
}

