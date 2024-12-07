import express, { Router } from 'express' // Importing express and Router from express
import { ReferralController } from '../controllers/referalController' // Importing the ReferralController
import { validate } from '../validator' // Importing the validation middleware
import {
    validateCreateReferral, // Validation for creating a referral
    validateGetReferralByCode, // Validation for getting a referral by code
    validateGetReferralsByReferrerId, // Validation for getting referrals by referrer ID
    validateGetReferralsByRefereeId, // Validation for getting referrals by referee ID
    validateGetReferralById // Validation for getting a referral by ID
} from '../validator/referalValidation' // Importing all validation schemas from referalValidation
import { verifyAuthToken } from '../middlewares/auth'

const referralRouter: Router = express.Router() // Creating a new Router instance for referrals
const referralController = new ReferralController() // Instantiating the ReferralController

// Route to create a new referral
referralRouter.post('/', verifyAuthToken, validate(validateCreateReferral as any), referralController.createReferral)

// Route to get a referral by its code
referralRouter.get('/code/:code', verifyAuthToken, validate(validateGetReferralByCode as any), referralController.getReferralByCode)

// Route to get all referrals for a specific referrer by ID
referralRouter.get(
    '/referrer/:referrerId',
    verifyAuthToken,
    validate(validateGetReferralsByReferrerId as any),
    referralController.getReferralsByReferrerId
)

// Route to get all referrals for a specific referee by ID
referralRouter.get(
    '/referee/:refereeId',
    verifyAuthToken,
    validate(validateGetReferralsByRefereeId as any),
    referralController.getReferralsByRefereeId
)

// Route to get a referral by its ID
referralRouter.get('/:id', verifyAuthToken, validate(validateGetReferralById as any), referralController.getReferralById)

export default referralRouter // Exporting the referralRouter for use in other parts of the application

