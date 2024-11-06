import express from 'express'
const wishlistRouter = express.Router()
import { WishlistController } from '../controllers/wishlistController.js'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { validate } from '../validator/index.js'
import { wishListSchema } from '../validator/wishlist/index.js'
const wishlistController = new WishlistController()

wishlistRouter.post('/', validate(wishListSchema), verifyJWT, wishlistController.addRemoveWishList)
wishlistRouter.get('/', verifyJWT, wishlistController.getwishLisOfUser)

export default wishlistRouter
