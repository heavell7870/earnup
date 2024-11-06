import express from 'express'
import userRouter from './userRouter.js'
import addressRouter from './addressRouter.js'
import wishlistRouter from './wishlistRouter.js'
import cartRouter from './cartRouter.js'
const router = express.Router()

router.use('/user', userRouter)
router.use('/address', addressRouter)
router.use('/wishlist', wishlistRouter)
router.use('/cart', cartRouter)

export default router
