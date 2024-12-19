"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralService = void 0;
const referalReposiroty_1 = require("../repositories/referalReposiroty");
const appError_1 = require("../utils/hanlders/appError");
const http_status_codes_1 = require("http-status-codes");
class ReferralService {
    constructor() {
        this.repository = new referalReposiroty_1.ReferalRepository();
    }
    async createReferral(referralData, referrerId) {
        try {
            // Generate a unique referral code
            let referralCode;
            let existingReferral;
            do {
                // Generate a random 8 character alphanumeric code
                referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
                // Check if it already exists
                existingReferral = await this.repository.getOne({ referralCode });
            } while (existingReferral);
            // Add the generated referral code to the data
            const referralWithCode = {
                ...referralData,
                referralCode,
                referrerId
            };
            // Create new referral
            const newReferral = await this.repository.create(referralWithCode);
            return newReferral;
        }
        catch (error) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, error.message);
        }
    }
    async updateReferralStatus(referralId, updateData) {
        // Find and update referral status
        const updatedReferral = await this.repository.updateById(referralId, updateData);
        return updatedReferral;
    }
    async getReferralByCode(referralCode) {
        // Find referral by code
        const referral = await this.repository.getOne({ referralCode });
        return referral;
    }
    async getReferralsByReferrerId(referrerId) {
        // Find all referrals for a referrer
        const referrals = await this.repository.getAll({ referrerId });
        return referrals;
    }
    async getReferralsByRefereeId(refereeId) {
        // Find all referrals for a referee
        const referrals = await this.repository.getAll({ refereeId });
        return referrals;
    }
    async getReferralById(id) {
        // Find referral by ID
        const referral = await this.repository.getById(id);
        return referral;
    }
}
exports.ReferralService = ReferralService;
//# sourceMappingURL=referalService.js.map