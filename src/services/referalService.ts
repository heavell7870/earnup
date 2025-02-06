import { ReferalRepository } from '../repositories/referalReposiroty'
import { IReferral } from '../models/referalModel'
import { AppError } from '../utils/hanlders/appError'
import { StatusCodes } from 'http-status-codes'
import { UserRepository } from '../repositories/userReposiroty'
import { ObjectId } from 'mongoose'

export class ReferralService {
    private repository: ReferalRepository
    private userRepository: UserRepository
    constructor() {
        this.repository = new ReferalRepository()
        this.userRepository = new UserRepository()
    }

    async createReferral(referralData: Partial<IReferral>, referrerId: ObjectId): Promise<IReferral> {
        try {
            const userData = await this.userRepository.getById(referrerId)
            if (!userData) {
                throw new AppError(StatusCodes.BAD_REQUEST, 'Referrer not found')
            }

            const referee = await this.userRepository.getById(referralData.refereeId!)
            if (!referee) {
                throw new AppError(StatusCodes.BAD_REQUEST, 'Referee not found')
            }

            // Add the generated referral code to the data
            const referralWithCode = {
                ...referralData,
                referralCode: userData.referralCode,
                referrerId
            }

            // Create new referral
            const newReferral = await this.repository.create(referralWithCode)
            return newReferral
        } catch (error: any) {
            throw new AppError(StatusCodes.BAD_REQUEST, error.message)
        }
    }

    async updateReferralStatus(referralId: string, updateData: Partial<IReferral>): Promise<IReferral | null> {
        // Find and update referral status
        const updatedReferral = await this.repository.updateById(referralId, updateData, { upsert: true })
        return updatedReferral
    }

    async getReferralByCode(referralCode: string): Promise<IReferral[]> {
        // Find referral by code
        const referral = await this.repository.getAll({ referralCode })
        return referral
    }

    async getReferralsByReferrerId(referrerId: string): Promise<IReferral[]> {
        // Find all referrals for a referrer
        const referrals = await this.repository.getAll({ referrerId })
        return referrals
    }

    async getReferralsByRefereeId(refereeId: string): Promise<IReferral[]> {
        // Find all referrals for a referee
        const referrals = await this.repository.getAll({ refereeId })
        return referrals
    }

    async getReferralById(id: ObjectId): Promise<IReferral | null> {
        // Find referral by ID
        const referral = await this.repository.getById(id)
        return referral
    }
}

