"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountRepository = void 0;
const index_1 = require("./index");
const appError_1 = require("../utils/hanlders/appError");
const bankAccountModel_1 = __importDefault(require("../models/bankAccountModel"));
class BankAccountRepository extends index_1.CrudRepository {
    constructor() {
        super(bankAccountModel_1.default);
    }
    async getBankAccountAggregation(filter) {
        try {
            const response = await this.model.aggregate(filter);
            return response;
        }
        catch (error) {
            throw new appError_1.AppError(error.statusCode || 500, error.message, error);
        }
    }
}
exports.BankAccountRepository = BankAccountRepository;
//# sourceMappingURL=bankAccountReposiroty.js.map