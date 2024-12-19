"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const index_1 = __importDefault(require("./configs/index"));
const index_2 = __importDefault(require("./utils/logger/index"));
const index_3 = require("./routes/index");
const index_4 = require("./utils/db/index");
const errorHandler_1 = require("./utils/hanlders/errorHandler");
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
/* express application with all global level middleware */
const createExpressApp = () => {
    const expressApp = (0, express_1.default)();
    expressApp.use((0, cors_1.default)({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
        // origin: [config.FRONTEND_URL],
        origin: '*',
        credentials: true
    }));
    expressApp.use((0, helmet_1.default)());
    expressApp.use(express_1.default.json());
    expressApp.use(express_1.default.urlencoded({ extended: true }));
    // Apply compression middleware with custom configuration
    expressApp.use((0, compression_1.default)({
        level: 6,
        threshold: 0,
        filter: (req, res) => {
            if (!req.headers['x-no-compression']) {
                return compression_1.default.filter(req, res);
            }
            return false; // Don't apply compression if 'x-no-compression' header is present
        }
    }));
    // Log an info message for each incoming request
    expressApp.use((req, res, next) => {
        index_2.default.info(`${req.method} ${req.originalUrl}`);
        next();
    });
    //passing app into appRouter
    (0, index_3.defineRoutes)(expressApp);
    //error handling middleware
    (0, globalErrorHandler_1.ErrorHandlingMiddleware)(expressApp);
    return expressApp;
};
/* start the server */
async function startServer() {
    //starting the server
    const httpServer = createExpressApp();
    //connect database
    let conf = await (0, index_4.connect)();
    if (conf && conf.connection) {
        index_2.default.info(`mongodb connected on port ${conf.connection.port}`);
    }
    else {
        index_2.default.error('Failed to connect to MongoDB');
    }
    //listen the server
    const appAddress = await listenServer(httpServer);
    index_2.default.info(`Server is running on ${appAddress.address}:${appAddress.port}`);
}
/*listen the server*/
async function listenServer(expressApp) {
    const serverPort = index_1.default.PORT;
    const connection = await expressApp.listen(serverPort);
    errorHandler_1.errorHandler.listenToErrorEvents(connection);
    return connection.address();
}
//# sourceMappingURL=server.js.map