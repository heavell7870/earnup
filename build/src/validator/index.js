"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../utils/hanlders/appError");
const http_status_codes_1 = require("http-status-codes");
const pick = (object, keys) => keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        obj[key] = object[key];
    }
    return obj;
}, {});
const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = joi_1.default.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object);
    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new appError_1.AppError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessage));
    }
    Object.assign(req, value);
    return next();
};
exports.validate = validate;
//# sourceMappingURL=index.js.map