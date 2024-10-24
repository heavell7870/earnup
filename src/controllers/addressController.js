import { AddressService } from "../services/addressService.js";
import { catchAsync } from "../utils/hanlders/catchAsync.js";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/hanlders/appResponse.js";
import { Helper } from "../utils/helper/index.js";

export class AddressController {
    constructor() {
        this.service = new AddressService();
    }
    findNearestStore = catchAsync(async (req, res) => {
        const stores = await Helper.findStoresNearUser(req.query.lat, req.query.lon);
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, stores, "Nearest stores fetched successfully"));
    })
    addAddressOfAUser = catchAsync(async (req, res) => {
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, "Token Missing in Headers")
        req.body.userId = req.user
        const address = await this.service.addAddress(req.body);
        return res.status(StatusCodes.CREATED).send(new ApiResponse(StatusCodes.CREATED, address, "User address added successfully"));
    })
    getSingleAddressOfAUser = catchAsync(async (req, res) => {
        const { addressId } = req.params;
        const address = await this.service.getAddress(addressId);
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, address, "User address Fetched successfully"));
    })
    getDefaultAddressOfAUser = catchAsync(async (req, res) => {
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, "Token Missing in Headers")
        const address = await this.service.getDefaultAddressOfUser(req.user);
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, address, "User address successfully"));
    })
    getAllAddressOfAUser = catchAsync(async (req, res) => {
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, "Token Missing in Headers")
        const address = await this.service.getAllAddressOfUser(req.user);
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, address, "User address successfully"));
    })
    updateAddressOfAUser = catchAsync(async (req, res) => {
        const { addressId } = req.params;
        const data = req.body
        if (!req?.user) throw new AppError(StatusCodes.UNAUTHORIZED, "Token Missing in Headers")
        const address = await this.service.updateAddress(addressId, req.user, data);
        return res.status(StatusCodes.OK).send(new ApiResponse(StatusCodes.OK, address, "User updated successfully"));
    })
    deleteAddressOfAUser = catchAsync(async (req, res) => {
        const { addressId } = req.params;
        const deletedAddress = await this.service.deleteAddress(addressId);
        return res.status(StatusCodes.NO_CONTENT).send(new ApiResponse(StatusCodes.NO_CONTENT, deletedAddress, "User address deleted successfully"));
    })
}