import { createLogger, format, transports, Logger } from 'winston'
import 'winston-daily-rotate-file'

class LogManager {
    private static instance: LogManager
    private logger: Logger

    private constructor() {
        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.errors({ stack: true }),
                format.splat(),
                format.json()
            ),
            transports: [
                new transports.DailyRotateFile({
                    level: 'error',
                    filename: 'logs/application-error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d'
                }),
                new transports.DailyRotateFile({
                    level: 'info',
                    filename: `logs/application-%DATE%.log`,
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d'
                })
            ]
        })

        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(
                new transports.Console({
                    format: format.combine(format.colorize(), format.simple())
                })
            )
        }
    }

    public getLogger(): Logger {
        return this.logger
    }

    public static getInstance(): LogManager {
        if (!LogManager.instance) {
            LogManager.instance = new LogManager()
        }

        return LogManager.instance
    }
}

export default LogManager.getInstance().getLogger()

