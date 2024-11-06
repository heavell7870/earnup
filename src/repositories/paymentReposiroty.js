import { CrudRepository } from './index.js'
import paymentModel from '../models/paymentModel.js'
import cartModel from '../models/cartModel.js'
import { AppError } from '../utils/hanlders/appError.js'
import instance from '../utils/razorpay/razorpay.js'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import { Helper } from '../utils/helper/index.js'
import { publishMessage } from '../utils/rabbitMq/index.js'

export class PaymentRepository extends CrudRepository {
    constructor() {
        super(paymentModel)
        this.cartModel=cartModel
    }
    async paymentAggregation(filter) {
        try {
            let response = await this.model.aggregate(filter)
            return response
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
async createOrderAggregation(userId, storeId, isCod,storeExist) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Optimize cart aggregation query
        let cartDetails = await this.cartModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'userAddresses',
                    let: { userId: new mongoose.Types.ObjectId(userId) },
                    pipeline: [
                        { $match: { $expr: { $and: [{ $eq: ['$userId', '$$userId'] }, { $eq: ['$isDefault', true] }] } } },
                        { $project: { _id: 1, address1: 1, address2: 1, city: 1, state: 1, pincode: 1, country: 1, latitude: 1, longitude: 1, deliveryDetails: 1, nearestStore: 1 } }
                    ],
                    as: 'userAddressDetails'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $lookup: {
                    from: 'varients',
                    localField: 'varientId',
                    foreignField: '_id',
                    as: 'varientDetails'
                }
            },
            { $unwind: '$productDetails' },
            { $unwind: '$varientDetails' },
            { $unwind: { path: '$userAddressDetails', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    quantity: 1,
                    productDetails: { _id: 1, thumbnail: 1, name: 1 },
                    varientDetails: { _id: 1, unit: 1, weight: 1, mrp: 1, availableQuantity: 1, storeId: 1, sellingPrice: 1 },
                    totalMrp: { $multiply: ['$varientDetails.mrp', '$quantity'] },
                    totalSellingPrice: { $multiply: ['$varientDetails.sellingPrice', '$quantity'] },
                    userAddressDetails: 1
                }
            },
            {
                $group: {
                    _id: '$userId',
                    fetchProducts: {
                        $push: {
                            _id: '$_id',
                            quantity: '$quantity',
                            productDetails: '$productDetails',
                            varientDetails: '$varientDetails',
                            totalMrp: '$totalMrp',
                            totalSellingPrice: '$totalSellingPrice',
                            notAvailable: {
                                $cond: {
                                    if: {
                                        $or: [
                                            { $eq: ['$varientDetails.availableQuantity', 0] },
                                            { $ne: ['$varientDetails.storeId', new mongoose.Types.ObjectId(storeId)] }
                                        ]
                                    },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    totalMaximumPrice: { $sum: '$totalMrp' },
                    totalSellingPrice: { $sum: '$totalSellingPrice' },
                    userAddressDetails: { $first: '$userAddressDetails' }
                }
            }
        ]);
        // Check for unavailable products
        if (!cartDetails.length) throw new AppError(StatusCodes.BAD_REQUEST, 'Products Unavailable');
        const unavailableProducts = cartDetails.length > 0 ? cartDetails[0].fetchProducts.filter(product => product.notAvailable) : [];
        if (unavailableProducts.length > 0) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Some Products Are Unavailable');
        }

        let priceDetails = {
            totalSellingPrice: cartDetails[0].totalSellingPrice,
            totalMaximumPrice: cartDetails[0].totalMaximumPrice,
        };

        let paymentObject = {
            userId: userId,
            storeId: storeId,
            products: cartDetails[0].fetchProducts,
            deliveryAddress: cartDetails[0].userAddressDetails,
        };
        if (cartDetails[0].userAddressDetails.nearestStore.toString() !== storeId) {
            let calculateDistance = await Helper.calculateDistance(
                [`${storeExist?.toObject()?.coordinates.coordinates[1]},${storeExist?.toObject()?.coordinates.coordinates[0]}`],
                [`${cartDetails[0].userAddressDetails?.latitude},${cartDetails[0].userAddressDetails?.longitude}`]
            );
            if (calculateDistance)
                priceDetails.deliveryCharges = Helper.calculateDeliveryCharges(calculateDistance.distance.split(' ')[0]);
        } else {
            priceDetails.deliveryCharges = Helper.calculateDeliveryCharges(
                cartDetails[0].userAddressDetails.deliveryDetails.distance.split(' ')[0]
            );
        }

        if (storeExist.isRaining || storeExist.isMidnight)
            priceDetails.surcharges = Helper.applySurcharge(storeExist.isRaining, storeExist.isMidnight);

        priceDetails.amountToPay =
            priceDetails.totalSellingPrice -
            (priceDetails.couponDiscount || 0) +
            priceDetails.deliveryCharges +
            (priceDetails.surcharges || 0);

        if (isCod) {
            paymentObject.paymentMode = 'cod';
            paymentObject.priceDetails = priceDetails;
            let createPayment = await this.model.create([paymentObject], { session });
            if (!createPayment) throw new AppError(StatusCodes.BAD_REQUEST, 'Something went wrong');
            await publishMessage('orderProcessingQueue', Buffer.from(JSON.stringify(createPayment[0])));
            await session.commitTransaction();
            session.endSession();
            return createPayment[0];
        } else {
            const order = await instance.orders.create({
                amount: priceDetails.amountToPay * 100, // Amount in paise
                currency: 'INR',
                receipt: `receipt_${userId}`,
                payment_capture: 1
            });
            paymentObject.paymentMode = 'razorpay';
            paymentObject.orderId = order.id;
            paymentObject.priceDetails = priceDetails;
            let createPayment = await this.model.create([paymentObject], { session });
            if (!createPayment) throw new AppError(StatusCodes.BAD_REQUEST, 'Something went wrong')
            await session.commitTransaction();
            session.endSession();
            return createPayment[0];
        }
    } catch (error) {
        // Enhanced error handling and logging for better insights
        console.error('Order creation failed:', error);
        await session.abortTransaction();
        session.endSession();
        throw new AppError(error.statusCode, error.message, error);
    }
}
}
