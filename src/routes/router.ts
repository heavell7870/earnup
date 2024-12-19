import express from 'express'
import userRouter from './userRouter'
import referralRouter from './referalRouter'
import bankAccountRouter from './bankAccountRouter'

const router = express.Router()

router.use('/user', userRouter)
router.use('/referral', referralRouter)
router.use('/bank-account', bankAccountRouter)
export default router

