import { CrudRepository } from './index'
import { AppError } from '../utils/hanlders/appError'
import { Model } from 'mongoose'
import mongoose from 'mongoose'
import adWatchedModel from '../models/adWatchedModel'
import { IAdWatched } from '../models/adWatchedModel'

export class AdWatchedRepository extends CrudRepository<IAdWatched> {
    constructor() {
        super(adWatchedModel as Model<IAdWatched, any, IAdWatched>) // Adjusted type casting to match expected Model<IUser>
    }

    async getAdWatchedAggregation(filter: any): Promise<IAdWatched[]> {
        try {
            const response = await this.model.aggregate(filter)
            return response as IAdWatched[]
        } catch (error: any) {
            throw new AppError(error.statusCode || 500, error.message, error)
        }
    }

    async getWeeklyAdWatchedStats(
        startDate?: Date,
        endDate?: Date
    ): Promise<{
        dailyAdWatched: { date: string; count: number }[]
        totalAdWatched: number
        growth: number
    }> {
        try {
            // Set default dates if not provided (last 7 days)
            const currentDate = new Date()
            const actualEndDate = endDate || new Date()
            const actualStartDate = startDate || new Date(currentDate.setDate(currentDate.getDate() - 7))

            // Get daily ad watched counts for each day in the week
            const dailyAdWatched = await this.model.aggregate([
                {
                    $match: {
                        watchedAt: { $gte: actualStartDate, $lte: actualEndDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            day: { $dayOfMonth: '$watchedAt' },
                            month: { $month: '$watchedAt' },
                            year: { $year: '$watchedAt' }
                        },
                        count: { $sum: 1 },
                        date: { $first: '$watchedAt' }
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

            // Get total ad watched for the week
            const totalAdWatchedResult = await this.model.aggregate([
                {
                    $match: {
                        watchedAt: { $gte: actualStartDate, $lte: actualEndDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ])

            const totalAdWatched = totalAdWatchedResult.length > 0 ? totalAdWatchedResult[0].count : 0

            // Calculate previous period dates
            const previousEndDate = new Date(actualStartDate)
            previousEndDate.setDate(previousEndDate.getDate() - 1)

            const previousStartDate = new Date(previousEndDate)
            previousStartDate.setDate(previousStartDate.getDate() - 7)

            // Get previous period total ad watched
            const previousPeriodResult = await this.model.aggregate([
                {
                    $match: {
                        watchedAt: { $gte: previousStartDate, $lte: previousEndDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ])

            const previousPeriodAdWatched = previousPeriodResult.length > 0 ? previousPeriodResult[0].count : 0

            // Calculate growth percentage
            let growth = 0
            if (previousPeriodAdWatched > 0) {
                growth = ((totalAdWatched - previousPeriodAdWatched) / previousPeriodAdWatched) * 100
            } else if (totalAdWatched > 0) {
                growth = 100 // If there were no ads watched in the previous period, growth is 100%
            }

            return {
                dailyAdWatched,
                totalAdWatched,
                growth
            }
        } catch (error: any) {
            throw new AppError(error.statusCode || 500, error.message, error)
        }
    }
}

