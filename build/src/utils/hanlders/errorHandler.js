"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeError = exports.errorHandler = void 0;
const util_1 = __importDefault(require("util"));
const appError_1 = require("./appError");
const db_1 = require("../db");
const mongoose_1 = __importDefault(require("mongoose"));
const process_1 = __importDefault(require("process"));
const logger_1 = __importDefault(require("../logger"));
let httpServerRef;
const errorHandler = {
    listenToErrorEvents: (httpServer) => {
        httpServerRef = httpServer;
        process_1.default.on('uncaughtException', async (error) => {
            await errorHandler.handleError(error);
        });
        process_1.default.on('unhandledRejection', async (reason) => {
            await errorHandler.handleError(reason);
        });
        process_1.default.on('SIGTERM', async () => {
            logger_1.default.error('App received SIGTERM event, try to gracefully close the server');
            await terminateHttpServerAndExit();
        });
        process_1.default.on('SIGINT', async () => {
            logger_1.default.error('App received SIGINT event, try to gracefully close the server');
            await terminateHttpServerAndExit();
        });
    },
    handleError: async (errorToHandle) => {
        try {
            const appError = normalizeError(errorToHandle);
            return appError;
        }
        catch (handlingError) {
            console.log(handlingError);
            process_1.default.stdout.write('The error handler failed. Here are the handler failure and then the origin error that it tried to handle: ');
            process_1.default.stdout.write(JSON.stringify(handlingError));
            process_1.default.stdout.write(JSON.stringify(errorToHandle));
        }
    }
};
exports.errorHandler = errorHandler;
const terminateHttpServerAndExit = async () => {
    if (httpServerRef) {
        await new Promise((resolve) => httpServerRef.close(resolve)); // Graceful shutdown
        await (0, db_1.disconnect)();
    }
    process_1.default.exit();
};
const normalizeError = (errorToHandle) => {
    if (errorToHandle instanceof appError_1.AppError) {
        return errorToHandle;
    }
    if (errorToHandle instanceof Error) {
        const appError = new appError_1.AppError(500, errorToHandle.message);
        appError.stack = errorToHandle.stack;
        return appError;
    }
    if (errorToHandle instanceof mongoose_1.default.Error) {
        const appError = new appError_1.AppError(500, errorToHandle.message);
        appError.stack = errorToHandle.stack;
        return appError;
    }
    const inputType = typeof errorToHandle;
    return new appError_1.AppError(500, `Error Handler received a non-error instance with type - ${inputType}, value - ${util_1.default.inspect(errorToHandle)}`);
};
exports.normalizeError = normalizeError;
//# sourceMappingURL=errorHandler.js.map