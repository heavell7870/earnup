import express, { Router } from 'express'
import { UserController } from '../controllers/userController'
import { validate } from '../validator'
import {
    validateCreateUserProfile,
    validateUpdateUserProfile,
    validateGetUserByFirebaseId,
    validateCheckUserNameExists,
    validateGetUserById
} from '../validator/userValidation'
import { verifyAuthToken } from '../middlewares/auth'

const userRouter: Router = express.Router()
const userController = new UserController()

userRouter.post('/profile', verifyAuthToken, validate(validateCreateUserProfile as any), userController.createUserProfile)
userRouter.put('/profile/:id', verifyAuthToken, validate(validateUpdateUserProfile as any), userController.updateUserProfile)
userRouter.get('/profile/:firebaseId', validate(validateGetUserByFirebaseId as any), userController.getUserByFirebaseId)
userRouter.get('/check-username/:userName', verifyAuthToken, validate(validateCheckUserNameExists as any), userController.checkUserNameExists)
userRouter.get('/:id', verifyAuthToken, validate(validateGetUserById as any), userController.getUserById)
userRouter.post('/login', userController.loginWithEmailPassword)
export default userRouter

