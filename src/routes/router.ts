import express from 'express'
import userRouter from './userRouter'
import referralRouter from './referalRouter'
import bankAccountRouter from './bankAccountRouter'
import adminRouter from './admin'

const router = express.Router()

router.use('/user', userRouter)
router.use('/referral', referralRouter)
router.use('/bank-account', bankAccountRouter)
router.use('/admin', adminRouter)
export default router

