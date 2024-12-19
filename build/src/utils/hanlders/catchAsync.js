"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAuthAsync = exports.catchAsync = void 0;
const catchAsync = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.catchAsync = catchAsync;
const catchAuthAsync = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.catchAuthAsync = catchAuthAsync;
//# sourceMappingURL=catchAsync.js.map