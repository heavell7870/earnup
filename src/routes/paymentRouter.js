import express from 'express'
const paymentRouter = express.Router()
import { PaymentController } from '../controllers/paymentController.js'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { validate } from '../validator/index.js'
import { addToCartSchema, updateCartSchema, getCartSchema } from '../validator/cart/index.js'
const paymentController = new PaymentController()

paymentRouter.post('/initiate', verifyJWT, paymentController.initiateOrder)
paymentRouter.get('/verify', verifyJWT, paymentController.verifyOrder)
paymentRouter.get('/user',verifyJWT,paymentController.getAllPaymentsOfUser)
paymentRouter.get('/list',verifyJWT,paymentController.getAllPayments)

export default paymentRouter
