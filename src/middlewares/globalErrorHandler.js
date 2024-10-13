import { errorHandler } from '../utils/hanlders/errorHandler.js';
import logger from '../utils/logger/index.js';
import configs from '../configs/index.js';

export function ErrorHandlingMiddleware(expressApp) {
    expressApp.use(async (error, req, res, next) => {
      if (error && typeof error === "object") {
        if (error.isTrusted === undefined || error.isTrusted === null) {
          error.isTrusted = true;
        }
      }
      let err=await errorHandler.handleError(error);
      const response = {
        ...error,
        message: error.message,
        ...(configs.NODE_ENV === "development" ? { stack: error.stack } : {}),
      };
      if(configs.NODE_ENV==="development"){
        logger.error(response);
      }
      return res.status(error.statusCode).send(response);
    });
}