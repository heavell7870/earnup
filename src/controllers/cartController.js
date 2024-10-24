import { CartService } from "../services/cartService.js";
import { catchAsync } from "../utils/hanlders/catchAsync.js";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/hanlders/appResponse.js";

export class CartController {
    constructor() {
        this.service = new CartService();
    }
    addToCart = catchAsync(async (req, res) => {
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, "Token Missing in Headers")
        req.body.userId = req.user
        const cart = await this.service.addProductInToCart(req.body);
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.CREATED, cart, "Product Added To successfully"));
    })
    incrementProductCount = catchAsync(async (req, res) => {
        const { cartId } = req.params
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, "Token Missing in Headers")
        const cart = await this.service.incrementProductQuantity(cartId,req.user);
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.CREATED, cart, "Product Quantity Increased successfully"));
    })
    decrementProductCount = catchAsync(async (req, res) => {
        const { cartId } = req.params
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, "Token Missing in Headers")
        const cart = await this.service.decrementProductQuantity(cartId,req.user);
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.CREATED, cart, "Product Quantity Decreased successfully"));
    })
    removeProduct = catchAsync(async (req, res) => {
        const { cartId } = req.params
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, "Token Missing in Headers")
            console.log(cartId,req.user)
        const cart = await this.service.deleteProductFromCart(cartId,req.user);
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.CREATED, cart, "Product Removed From Cart successfully"));
    })
    getCart = catchAsync(async (req, res) => {
        const { storeId } = req.params
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, "Token Missing in Headers")
        const cart = await this.service.getCartOfAUser(req.user,storeId);
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.CREATED, cart, "cart fetched To successfully"));
    })
}