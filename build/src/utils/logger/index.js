"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
require("winston-daily-rotate-file");
class LogManager {
    constructor() {
        this.logger = (0, winston_1.createLogger)({
            level: 'info',
            format: winston_1.format.combine(winston_1.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
            transports: [
                new winston_1.transports.DailyRotateFile({
                    level: 'error',
                    filename: 'logs/application-error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d'
                }),
                new winston_1.transports.DailyRotateFile({
                    level: 'info',
                    filename: `logs/application-%DATE%.log`,
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d'
                })
            ]
        });
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston_1.transports.Console({
                format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
            }));
        }
    }
    getLogger() {
        return this.logger;
    }
    static getInstance() {
        if (!LogManager.instance) {
            LogManager.instance = new LogManager();
        }
        return LogManager.instance;
    }
}
exports.default = LogManager.getInstance().getLogger();
//# sourceMappingURL=index.js.map