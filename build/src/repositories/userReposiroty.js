"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const index_1 = require("./index");
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = require("../utils/hanlders/appError");
class UserRepository extends index_1.CrudRepository {
    constructor() {
        super(userModel_1.default); // Adjusted type casting to match expected Model<IUser>
    }
    async getUserAggregation(filter) {
        try {
            const response = await this.model.aggregate(filter);
            return response;
        }
        catch (error) {
            throw new appError_1.AppError(error.statusCode || 500, error.message, error);
        }
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userReposiroty.js.map