import express from 'express'
const orderRouter = express.Router()
import { OrderController } from '../controllers/orderController.js'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { validate } from '../validator/index.js'
import { addToCartSchema, updateCartSchema, getCartSchema } from '../validator/cart/index.js'
const orderController = new OrderController()

orderRouter.get('/user', verifyJWT, orderController.getAllUserOrders)
orderRouter.get('/store/:storeId', verifyJWT, orderController.getAllStoreOrders)
orderRouter.get('/all', verifyJWT, orderController.getAllOrders)
orderRouter.patch('/cancel/:orderId',verifyJWT,orderController.cancelOrder)
orderRouter.patch('/',verifyJWT,orderController.updateAOrder)

export default orderRouter
