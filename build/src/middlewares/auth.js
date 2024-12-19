"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = void 0;
const admin = __importStar(require("firebase-admin"));
const userService_1 = require("../services/userService");
const appError_1 = require("../utils/hanlders/appError");
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = require("../utils/hanlders/catchAsync");
const userService = new userService_1.UserService();
exports.verifyAuthToken = (0, catchAsync_1.catchAuthAsync)(async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'No token provided');
        }
        const token = authHeader.split(' ')[1];
        // Verify the Firebase token
        const decodedToken = await admin.auth().verifyIdToken(token);
        if (!decodedToken) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid token');
        }
        // Get user from database using firebase ID
        const user = await userService.getUserByFirebaseId(decodedToken.uid);
        if (!user) {
            throw new appError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not found');
        }
        // Attach user to request object
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof appError_1.AppError) {
            throw error;
        }
        throw new appError_1.AppError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Authentication failed');
    }
});
//# sourceMappingURL=auth.js.map