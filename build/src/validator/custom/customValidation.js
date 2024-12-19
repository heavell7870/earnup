"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const objectId = (value, helpers) => {
    if (!mongoose_1.default.isValidObjectId(value)) {
        return helpers.message({ custom: '"{{#label}}" must be a valid mongo id' });
    }
    return value;
};
exports.objectId = objectId;
//# sourceMappingURL=customValidation.js.map