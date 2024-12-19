"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
const catchAsync_1 = require("../utils/hanlders/catchAsync");
const http_status_codes_1 = require("http-status-codes");
const appResponse_1 = require("../utils/hanlders/appResponse");
class UserController {
    constructor() {
        this.createUserProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const userData = req.body;
            const newUser = await this.service.createUserProfile(userData);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, newUser, 'User profile created successfully'));
        });
        this.updateUserProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const updateData = req.body;
            const updatedUser = await this.service.updateUserProfile(id, updateData);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, updatedUser, 'User profile updated successfully'));
        });
        this.getUserByFirebaseId = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { firebaseId } = req.params;
            const user = await this.service.getUserByFirebaseId(firebaseId);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, user, 'User profile retrieved successfully'));
        });
        this.checkUserNameExists = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { userName } = req.params;
            const exists = await this.service.checkUserNameExists(userName);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, { exists }, 'Username availability checked'));
        });
        this.getUserById = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { id } = req.params;
            const user = await this.service.getUserById(id);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, user, 'User profile retrieved successfully'));
        });
        this.loginWithEmailPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { email, password } = req.body;
            const user = await this.service.loginWithEmailPassword(email, password);
            return res.status(http_status_codes_1.StatusCodes.OK).send(new appResponse_1.ApiResponse(http_status_codes_1.StatusCodes.OK, user, 'User logged in successfully'));
        });
        this.service = new userService_1.UserService();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map