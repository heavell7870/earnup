import { StatusCodes } from 'http-status-codes'
import { CartRepository } from '../repositories/cartReposiroty.js'
import { UserRepository } from '../repositories/userReposiroty.js'
import { ProductRepository } from '../repositories/productRepository.js'
import { VarientRepository } from '../repositories/productRepository.js'
import { StoreRepository } from '../repositories/productRepository.js'
import { AppError } from '../utils/hanlders/appError.js'
import mongoose from 'mongoose'
import { Helper } from '../utils/helper/index.js'

export class CartService {
    constructor() {
        this.repository = new CartRepository()
        this.userRepository = new UserRepository()
        this.productRepository = new ProductRepository()
        this.variantRepository = new VarientRepository()
        this.storeRepository = new StoreRepository()
    }
    async addProductInToCart(data) {
        try {
            const [userExist, productExist, variantExist, cartExist] = await Promise.all([
                this.userRepository.getById(data.userId),
                this.productRepository.getById(data.productId),
                this.variantRepository.getById(data.varientId),
                this.repository.getOne({ userId: data.userId, productId: data.productId, varientId: data.varientId })
            ])
            if (!userExist || !productExist || !variantExist) throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid data')
            if (data.quantity > variantExist.availableQuantity)
                throw new AppError(StatusCodes.BAD_REQUEST, `You can add up to ${variantExist.availableQuantity} pieces of this product`)
            if (cartExist) {
                let updateCart = await this.repository.updateById(cartExist._id, { quantity: cartExist.quantity + data.quantity })
                return updateCart
            } else {
                let newCart = await this.repository.create(data)
                return newCart
            }
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async deleteProductFromCart(cartId, userId) {
        try {
            const [userExist, cartExist] = await Promise.all([this.userRepository.getById(userId), this.repository.getOne({ _id: cartId, userId })])
            if (!userExist) throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found')
            if (!cartExist) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found in cart')
            return await this.repository.deleteById(cartId)
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async incrementProductQuantity(cartId, userId) {
        try {
            const [userExist, cartExist] = await Promise.all([this.userRepository.getById(userId), this.repository.getOne({ _id: cartId, userId })])
            if (!userExist) throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found')
            if (!cartExist) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found in cart')
            let varientDetails = await this.variantRepository.getById(cartExist.varientId)
            // Check if stock is available for the requested quantity
            if (varientDetails.availableQuantity < cartExist.quantity + 1) {
                throw new AppError(StatusCodes.BAD_REQUEST, `You can add up to ${varientDetails.availableQuantity} pieces of this product`)
            }
            // Update cart quantity and prices
            const updatedCart = await this.repository.updateById(cartId, { quantity: cartExist.quantity + 1 })
            return updatedCart
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async decrementProductQuantity(cartId, userId) {
        try {
            const [userExist, cartExist] = await Promise.all([this.userRepository.getById(userId), this.repository.getOne({ _id: cartId, userId })])
            if (!userExist) throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found')
            if (!cartExist) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found in cart')
            if (cartExist.quantity > 1) {
                // Decrease quantity
                return await this.repository.updateById(cartId, { quantity: cartExist.quantity - 1 })
            }
            // Remove item if quantity becomes 0
            return await this.repository.deleteById(cartId)
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async getCartOfAUser(userId, storeId) {
        try {
            // Check if the user exists
            const [userExist, storeExist] = await Promise.all([this.userRepository.getById(userId), this.storeRepository.getById(storeId)])
            if (!userExist) throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found')
            if (!storeExist) throw new AppError(StatusCodes.NOT_FOUND, 'Store Not Found')
            let cartDetails = await this.repository.getcartAggregation([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Match userId in the cart collection
                {
                    $lookup: {
                        from: 'userAddresses',
                        let: { userId: new mongoose.Types.ObjectId(userId) },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$userId', '$$userId'] }, // Match by userId
                                            { $eq: ['$isDefault', true] } // Select only the default address
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    address1: 1,
                                    address2: 1,
                                    city: 1,
                                    state: 1,
                                    pincode: 1,
                                    country: 1,
                                    latitude: 1,
                                    longitude: 1,
                                    deliveryDetails: 1,
                                    nearestStore: 1
                                }
                            }
                        ],
                        as: 'userAddressDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'products', // Name of the product collection
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'varients', // Name of the variant collection
                        localField: 'varientId',
                        foreignField: '_id',
                        as: 'varientDetails'
                    }
                },
                {
                    $unwind: '$productDetails' // Deconstruct product array
                },
                {
                    $unwind: '$varientDetails' // Deconstruct variant array
                },
                {
                    $unwind: { path: '$userAddressDetails', preserveNullAndEmptyArrays: true } // Unwind address array (preserving null values)
                },
                {
                    // Project only the necessary fields, and calculate totals based on quantity
                    $project: {
                        _id: 1, // Cart ID
                        quantity: 1,
                        productDetails: {
                            _id: 1,
                            thumbnail: 1,
                            name: 1
                        },
                        varientDetails: {
                            unit: 1,
                            weight: 1,
                            mrp: 1,
                            availableQuantity: 1,
                            sellingPrice: 1,
                            storeId: 1
                        },
                        totalMrp: { $multiply: ['$varientDetails.mrp', '$quantity'] }, // Calculate total MRP
                        totalSellingPrice: { $multiply: ['$varientDetails.sellingPrice', '$quantity'] }, // Calculate total Selling Price
                        userAddressDetails: 1 // Include address details in projection
                    }
                },
                {
                    $addFields: {
                        notAvailable: {
                            $or: [
                                { $eq: ['$varientDetails.availableQuantity', 0] },
                                { $ne: ['$varientDetails.storeId', new mongoose.Types.ObjectId(storeId)] }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: '$userId', // Group by userId
                        fetchProducts: {
                            $push: {
                                _id: '$_id',
                                quantity: '$quantity',
                                productDetails: '$productDetails',
                                varientDetails: '$varientDetails',
                                totalMrp: '$totalMrp',
                                totalSellingPrice: '$totalSellingPrice',
                                notAvailable: '$notAvailable'
                            }
                        }, // Push the products without address
                        totalMaximumPrice: { $sum: '$totalMrp' }, // Sum of total MRP for all products
                        totalSellingPrice: { $sum: '$totalSellingPrice' }, // Sum of total Selling Price for all products
                        userAddressDetails: { $first: '$userAddressDetails' } // Include only the first default address
                    }
                }
            ])
            if (!cartDetails || cartDetails.length === 0) return cartDetails
            const cart = cartDetails[0]
            // Return all necessary details
            let responseObj = {
                userId: userId,
                products: cart.fetchProducts,
                address: cart.userAddressDetails ?? null
            }
            if (cart.userAddressDetails) {
                let nearbyStores = await Helper.findStoresNearUser(
                    Number(cart.userAddressDetails.latitude),
                    Number(cart.userAddressDetails.longitude)
                )
                if (!nearbyStores.length) responseObj.isServicable = false
                // if(storeId.toString() !== nearbyStores[0]['_id'].toString()) responseObj.isDifferentStore = true
            }
            if (!storeExist?.toObject()?.online || !storeExist?.toObject()?.open) responseObj.isServicable = false
            responseObj.priceDetails = {
                totalSellingPrice: cart.totalSellingPrice,
                totalMaximumPrice: cart.totalMaximumPrice,
                couponDiscount: 20,
                deliveryCharges: 35
            }
            if (!responseObj?.isServicable) {
                if (cart.userAddressDetails.nearestStore.toString() != storeId) {
                    let calculateDistance = await Helper.calculateDistance(
                        [
                            storeExist?.toObject()?.coordinates.coordinates[1].toString() +
                                ',' +
                                storeExist?.toObject()?.coordinates.coordinates[0].toString()
                        ],
                        [cart.userAddressDetails?.latitude + ',' + cart.userAddressDetails?.longitude]
                    )
                    responseObj.DeliveryDetails = calculateDistance
                    if (calculateDistance)
                        responseObj.priceDetails.deliveryCharges = Helper.calculateDeliveryCharges(calculateDistance.distance.split(' ')[0])
                } else {
                    responseObj.DeliveryDetails = cart.userAddressDetails.deliveryDetails
                    responseObj.priceDetails.deliveryCharges = Helper.calculateDeliveryCharges(
                        cart.userAddressDetails.deliveryDetails.distance.split(' ')[0]
                    )
                }
            }
            if (storeExist.isRaining || storeExist.isMidnight)
                responseObj.priceDetails.surcharges = Helper.applySurcharge(storeExist.isRaining, storeExist.isMidnight)
            responseObj.priceDetails.amountToPay =
                responseObj.priceDetails.totalSellingPrice -
                (responseObj.priceDetails.couponDiscount || 0) +
                responseObj.priceDetails.deliveryCharges +
                (responseObj.priceDetails.surcharges || 0)
            return responseObj
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }

    async emptyCart(userId) {
        try {
            let emptyCart = await this.repository.deleteMany({ userId: userId })
            return emptyCart
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
}
