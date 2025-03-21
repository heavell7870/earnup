import express from 'express'
import { AdminController } from '../controllers/admin.controller'
import {
    validateGetEarningsGrowth,
    validateGetWeeklyActiveUsers,
    validateGetWeeklyAdWatchedStats,
    validateGetUserList,
    validateGetUserData
} from '../validator/adminValidation'
import { validate } from '../validator'
import { verifyAdminAuthToken } from '../middlewares/auth'

const router = express.Router()
const controller = new AdminController()

// Apply authentication and admin middleware to all routes
router.use(verifyAdminAuthToken)

// Admin routes
router.get('/earnings-growth/:userId?', validate(validateGetEarningsGrowth as any), controller.getEarningsGrowth)
router.get('/weekly-active-users', validate(validateGetWeeklyActiveUsers as any), controller.getWeeklyActiveUsers)
router.get('/weekly-ad-watched-stats', validate(validateGetWeeklyAdWatchedStats as any), controller.getWeeklyAdWatchedStats)
router.get('/users', validate(validateGetUserList as any), controller.getUserList)
router.get('/users/:userId', validate(validateGetUserData as any), controller.getUserData)

export default router

