import express from 'express';
const userRouter= express.Router()
import { UserController } from '../controllers/userController.js';
import { verifyJWT,verifyPermission } from '../middlewares/authMiddleware.js';
import { validate } from '../validator/index.js';
import { loginSchema,validateOtpSchema,adminUserSchema,getAllUserSchema,deleteUserSchema,verifyEmailSchema,accessTokens,updateUserSchema,logoutSchema } from '../validator/user/index.js'
const userController = new UserController();


userRouter.post('/login',validate(loginSchema),userController.login)
userRouter.post('/validate',validate(validateOtpSchema),userController.validateOTP)
userRouter.get('/',validate(adminUserSchema),verifyJWT,userController.getCurrentUser)
userRouter.get('/all',validate(getAllUserSchema),verifyJWT,userController.getAllUser)
userRouter.patch('/',validate(updateUserSchema),verifyJWT,userController.updateUser)
userRouter.delete('/:user_id',validate(deleteUserSchema),verifyJWT,verifyPermission,userController.deleteUser)
userRouter.post('/access',validate(accessTokens),userController.genrateAcessToken)
userRouter.get('/verify-email',verifyJWT,userController.sentEmailVerificationLink)
userRouter.get('/verify-email/:token',validate(verifyEmailSchema),userController.verifyEmail)
userRouter.post('/logout',validate(logoutSchema),verifyJWT,userController.logout)

export default userRouter