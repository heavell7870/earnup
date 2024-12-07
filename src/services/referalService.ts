import { ReferalRepository } from '../repositories/referalReposiroty'
import { IReferral } from '../models/referalModel'
import { AppError } from '../utils/hanlders/appError'
import { StatusCodes } from 'http-status-codes'

export class ReferralService {
    private repository: ReferalRepository

    constructor() {
        this.repository = new ReferalRepository()
    }

    async createReferral(referralData: Partial<IReferral>, referrerId: string): Promise<IReferral> {
        try {
            // Generate a unique referral code
            let referralCode
            let existingReferral
            do {
                // Generate a random 8 character alphanumeric code
                referralCode = Math.random().toString(36).substring(2, 10).toUpperCase()
                // Check if it already exists
                existingReferral = await this.repository.getOne({ referralCode })
            } while (existingReferral)

            // Add the generated referral code to the data
            const referralWithCode = {
                ...referralData,
                referralCode,
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
        const updatedReferral = await this.repository.updateById(referralId, updateData)
        return updatedReferral
    }

    async getReferralByCode(referralCode: string): Promise<IReferral | null> {
        // Find referral by code
        const referral = await this.repository.getOne({ referralCode })
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

    async getReferralById(id: string): Promise<IReferral | null> {
        // Find referral by ID
        const referral = await this.repository.getById(id)
        return referral
    }
}

