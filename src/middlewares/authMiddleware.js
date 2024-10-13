import { catchAsync } from '../utils/hanlders/catchAsync.js';
import { AppError } from '../utils/hanlders/appError.js';
import configs from '../configs/index.js';
import { StatusCodes } from 'http-status-codes';
import { Helper } from '../utils/helper/index.js';
import blackListedToken from '../models/blackListedToken.js';

export const verifyJWT = catchAsync(async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized request");
    }

    try {
        const decodedToken = await Helper.decodeAccessToken(token)
        if (!decodedToken) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid access token");
        }
        req.user = decodedToken.id;
        if (decodedToken.roleId) req.roleId = decodedToken.roleId
        next();
    } catch (error) {
        throw new AppError(401, error?.message || "Invalid access token");
    }
});

export const verifyPermission = catchAsync(async (req, res, next) => {
    if (!req?.roleId) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized request");
    }
    if (req.roleId === "0") {
        next();
    } else {
        throw new AppError(StatusCodes.FORBIDDEN, "You are not allowed to perform this action");
    }
});

export const verifyToken = catchAsync(async (req, res, next) => {
    try {
        if (req.headers.authorization || req.cookies?.accessToken) {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            let result = await blackListedToken.findOne({ accessToken: token });
            if (result) throw new AppError(StatusCodes.FORBIDDEN, 'Token is Tampered');
        }
        next();
    } catch (error) {
        throw new AppError(StatusCodes.UNAUTHORIZED, error?.message || "Invalid access token");
    }
});