"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineRoutes = defineRoutes;
const logger_1 = __importDefault(require("../utils/logger"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const router_1 = __importDefault(require("./router"));
const path_1 = __importDefault(require("path"));
function defineRoutes(expressApp) {
    logger_1.default.info('Defining routes...');
    expressApp.use('/api/v1', router_1.default);
    console.log({ __dirname });
    // Serve static files from the 'files' directory
    expressApp.use('/api/v1/files', express_1.default.static(path_1.default.join(__dirname, '../../../files')));
    // health check
    expressApp.get('/health-check', (req, res) => {
        res.status(http_status_codes_1.StatusCodes.OK).send({ message: 'health check successful', status: true });
    });
    // 404 handler
    expressApp.use((req, res) => {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send('Api Not Found');
    });
    logger_1.default.info('Routes defined');
}
//# sourceMappingURL=index.js.map