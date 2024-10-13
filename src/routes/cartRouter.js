import express from 'express';
const cartRouter= express.Router()
import { CartController } from '../controllers/cartController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { validate } from '../validator/index.js';
import { addToCartSchema,updateCartSchema } from '../validator/cart/index.js'
const cartController = new CartController();

cartRouter.post('/add',validate(addToCartSchema),verifyJWT,cartController.addToCart)
cartRouter.delete('/remove/:cartId',validate(updateCartSchema),verifyJWT,cartController.removeProduct)
cartRouter.patch('/inc/:cartId',validate(updateCartSchema),verifyJWT,cartController.incrementProductCount)
cartRouter.patch('/dec/:cartId',validate(updateCartSchema),verifyJWT,cartController.decrementProductCount)
cartRouter.get('/fetch',verifyJWT,cartController.getCart)

export default cartRouter