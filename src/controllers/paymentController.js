import { CartService } from "../services/cartService.js";
import { catchAsync } from "../utils/hanlders/catchAsync.js";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/hanlders/appResponse.js";

export class PaymentController {
    constructor() {
        this.service = new CartService();
    }
}