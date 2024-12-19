"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const logger_1 = __importDefault(require("./utils/logger"));
const StartServer = async () => {
    logger_1.default.info('Starting server...');
    await (0, server_1.startServer)();
};
StartServer();
//# sourceMappingURL=index.js.map