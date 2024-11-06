import express from 'express'
const addressRouter = express.Router()
import { AddressController } from '../controllers/addressController.js'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { validate } from '../validator/index.js'
import { addAddressSchema, updateAddressSchema, deleteAddressSchema, singleAddressSchema, nearByAddressSchema } from '../validator/address/index.js'
const addressController = new AddressController()

addressRouter.get('/nearest', validate(nearByAddressSchema), addressController.findNearestStore)
addressRouter.post('/', validate(addAddressSchema), verifyJWT, addressController.addAddressOfAUser)
addressRouter.get('/default', verifyJWT, addressController.getDefaultAddressOfAUser)
addressRouter.get('/all', verifyJWT, addressController.getAllAddressOfAUser)
addressRouter.get('/:addressId', validate(singleAddressSchema), verifyJWT, addressController.getSingleAddressOfAUser)
addressRouter.patch('/:addressId', validate(updateAddressSchema), verifyJWT, addressController.updateAddressOfAUser)
addressRouter.delete('/:addressId', validate(deleteAddressSchema), verifyJWT, addressController.deleteAddressOfAUser)

export default addressRouter
