"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlingMiddleware = ErrorHandlingMiddleware;
const errorHandler_1 = require("../utils/hanlders/errorHandler");
const logger_1 = __importDefault(require("../utils/logger"));
const configs_1 = __importDefault(require("../configs"));
function ErrorHandlingMiddleware(expressApp) {
    expressApp.use(async (error, req, res, next) => {
        try {
            console.log('ErrorHandlingMiddleware');
            if (error && typeof error === 'object') {
                if (error.isTrusted === undefined || error.isTrusted === null) {
                    error.isTrusted = true;
                }
            }
            let err = await errorHandler_1.errorHandler.handleError(error);
            const response = {
                ...error,
                message: error.message,
                ...(configs_1.default.NODE_ENV === 'development' ? { stack: error.stack } : {})
            };
            if (configs_1.default.NODE_ENV === 'development') {
                logger_1.default.error(response);
            }
            console.log('ErrorHandlingMiddleware1');
            return res.status(error.statusCode || 500).send(response);
        }
        catch (error) {
            console.log(error);
        }
    });
}
//# sourceMappingURL=globalErrorHandler.js.map