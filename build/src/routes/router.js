"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./userRouter"));
const referalRouter_1 = __importDefault(require("./referalRouter"));
const bankAccountRouter_1 = __importDefault(require("./bankAccountRouter"));
const router = express_1.default.Router();
router.use('/user', userRouter_1.default);
router.use('/referral', referalRouter_1.default);
router.use('/bank-account', bankAccountRouter_1.default);
exports.default = router;
//# sourceMappingURL=router.js.map