import { WishlistService } from "../services/wishlistService.js";
import { catchAsync } from "../utils/hanlders/catchAsync.js";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/hanlders/appResponse.js";

export class WishlistController {
    constructor() {
        this.service = new WishlistService();
    }
    addRemoveWishList=catchAsync(async(req,res)=>{
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, "Token Missing in Headers")
            req.body.userId = req.user
            const wishlist = await this.service.addRemoveProductFromWishlist(req.body);
            return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, wishlist, "wishlist updated successfully"));
    })
    getwishLisOfUser=catchAsync(async(req,res)=>{
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, "Token Missing in Headers")
            const wishlist = await this.service.getAllWishlistOfAUser(req.user);
            return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, wishlist, "wishlist fetched successfully"));
    })
}