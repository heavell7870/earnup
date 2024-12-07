import express from 'express'
import userRouter from './userRouter'
import referralRouter from './referalRouter'

const router = express.Router()

router.use('/user', userRouter)
router.use('/referral', referralRouter)

export default router

