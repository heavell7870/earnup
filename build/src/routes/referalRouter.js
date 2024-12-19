"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Importing express and Router from express
const referalController_1 = require("../controllers/referalController"); // Importing the ReferralController
const validator_1 = require("../validator"); // Importing the validation middleware
const referalValidation_1 = require("../validator/referalValidation"); // Importing all validation schemas from referalValidation
const auth_1 = require("../middlewares/auth");
const referralRouter = express_1.default.Router(); // Creating a new Router instance for referrals
const referralController = new referalController_1.ReferralController(); // Instantiating the ReferralController
// Route to create a new referral
referralRouter.post('/', auth_1.verifyAuthToken, (0, validator_1.validate)(referalValidation_1.validateCreateReferral), referralController.createReferral);
// Route to get a referral by its code
referralRouter.get('/code/:code', auth_1.verifyAuthToken, (0, validator_1.validate)(referalValidation_1.validateGetReferralByCode), referralController.getReferralByCode);
// Route to get all referrals for a specific referrer by ID
referralRouter.get('/referrer/:referrerId', auth_1.verifyAuthToken, (0, validator_1.validate)(referalValidation_1.validateGetReferralsByReferrerId), referralController.getReferralsByReferrerId);
// Route to get all referrals for a specific referee by ID
referralRouter.get('/referee/:refereeId', auth_1.verifyAuthToken, (0, validator_1.validate)(referalValidation_1.validateGetReferralsByRefereeId), referralController.getReferralsByRefereeId);
// Route to get a referral by its ID
referralRouter.get('/:id', auth_1.verifyAuthToken, (0, validator_1.validate)(referalValidation_1.validateGetReferralById), referralController.getReferralById);
exports.default = referralRouter; // Exporting the referralRouter for use in other parts of the application
//# sourceMappingURL=referalRouter.js.map