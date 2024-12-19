"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralController = void 0;
const referalService_1 = require("../services/referalService");
const catchAsync_1 = require("../utils/hanlders/catchAsync");
const http_status_codes_1 = require("http-status-codes");
const appResponse_1 = require("../utils/hanlders/appResponse");
class ReferralController {
    constructor() {
        this.createReferral = (0, catchAsync_1.catchAuthAsync)(async (req, res) => {
            const referralData = req.body;
            const { id } = req.user;
            const newReferral = await this.service.createReferral(referralData, id);
            return res.status(http_status_codes_1.StatusCodes.CREATED).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.CREATED, newReferral, 'Referral created successfully'));
        });
        this.getReferralByCode = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { code } = req.params;
            const referral = await this.service.getReferralByCode(code);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, referral, 'Referral retrieved successfully'));
        });
        this.getReferralsByReferrerId = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { referrerId } = req.params;
            const referrals = await this.service.getReferralsByReferrerId(referrerId);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, referrals, 'Referrals retrieved successfully'));
        });
        this.getReferralsByRefereeId = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { refereeId } = req.params;
            const referrals = await this.service.getReferralsByRefereeId(refereeId);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, referrals, 'Referrals retrieved successfully'));
        });
        this.getReferralById = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const referral = await this.service.getReferralById(id);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, referral, 'Referral retrieved successfully'));
        });
        this.service = new referalService_1.ReferralService();
    }
}
exports.ReferralController = ReferralController;
//# sourceMappingURL=referalController.js.map