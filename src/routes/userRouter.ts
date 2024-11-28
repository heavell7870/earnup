import express, { Router } from 'express'
import { UserController } from '../controllers/userController'
import { validate } from '../validator'
import {
    validateLoginWithFacebook,
    validateLoginWithGoogle,
    validateLoginWithEmailPassword,
    validateRefreshToken,
    validateChangePassword,
    validateSignUpWithEmailPassword
} from '../validator/user'

const userRouter: Router = express.Router()
const userController = new UserController()

userRouter.post('/login/facebook', validate(validateLoginWithFacebook as any), userController.loginWithFacebook)
userRouter.post('/login/google', validate(validateLoginWithGoogle as any), userController.loginWithGoogle)
userRouter.post('/login/email-password', validate(validateLoginWithEmailPassword as any), userController.loginWithEmailPassword)
userRouter.post('/signup/email-password', validate(validateSignUpWithEmailPassword as any), userController.signUpWithEmailPassword)
userRouter.post('/logout', userController.logout)
userRouter.post('/refresh-token', validate(validateRefreshToken as any), userController.refreshToken)
userRouter.post('/change-password', validate(validateChangePassword as any), userController.changePassword)

export default userRouter

