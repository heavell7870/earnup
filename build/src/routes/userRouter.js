"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validator_1 = require("../validator");
const userValidation_1 = require("../validator/userValidation");
const auth_1 = require("../middlewares/auth");
const userRouter = express_1.default.Router();
const userController = new userController_1.UserController();
userRouter.post('/profile', auth_1.verifyAuthToken, (0, validator_1.validate)(userValidation_1.validateCreateUserProfile), userController.createUserProfile);
userRouter.put('/profile/:id', auth_1.verifyAuthToken, (0, validator_1.validate)(userValidation_1.validateUpdateUserProfile), userController.updateUserProfile);
userRouter.get('/profile/:firebaseId', (0, validator_1.validate)(userValidation_1.validateGetUserByFirebaseId), userController.getUserByFirebaseId);
userRouter.get('/check-username/:userName', auth_1.verifyAuthToken, (0, validator_1.validate)(userValidation_1.validateCheckUserNameExists), userController.checkUserNameExists);
userRouter.get('/:id', auth_1.verifyAuthToken, (0, validator_1.validate)(userValidation_1.validateGetUserById), userController.getUserById);
userRouter.post('/login', userController.loginWithEmailPassword);
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map