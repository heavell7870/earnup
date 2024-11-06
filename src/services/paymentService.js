import { StatusCodes } from 'http-status-codes';
import { PaymentRepository } from '../repositories/paymentReposiroty.js';
import { CartRepository } from '../repositories/cartReposiroty.js';
import { UserRepository } from '../repositories/userReposiroty.js';
import { AddressRepository } from '../repositories/addressReposiroty.js';
import { ProductRepository } from '../repositories/productRepository.js';
import { VarientRepository } from '../repositories/productRepository.js';
import { StoreRepository } from '../repositories/productRepository.js';
import { OrderRepository } from '../repositories/orderReposiroty.js';
import { AppError } from '../utils/hanlders/appError.js';
import { Helper } from '../utils/helper/index.js';


export class PaymentService {
    constructor() {
        this.repository = new PaymentRepository()
        this.orderRepository = new OrderRepository()
        this.addressRepository = new AddressRepository()
        this.cartRepository = new CartRepository()
        this.userRepository = new UserRepository()
        this.productRepository = new ProductRepository()
        this.varientRepository = new VarientRepository()
        this.storeRepository = new StoreRepository()
    }

    // async createOrder(userId, storeId, isCod) {
    //     try {
    //         // Use Promise.all for parallel execution
    //         const [userExist, storeExist, userDefaultAddresses] = await Promise.all([
    //             this.userRepository.getById(userId),
    //             this.storeRepository.getById(storeId),
    //             this.addressRepository.getOne({ userId: userId, isDefault: true })
    //         ]);

    //         if (!userExist) throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found');
    //         if (!storeExist) throw new AppError(StatusCodes.NOT_FOUND, 'Store Not Found');
    //         if (!userDefaultAddresses) throw new AppError(StatusCodes.NOT_FOUND, 'Default Address Not Found');
    //         if (userDefaultAddresses.nearestStore.toString() !== storeId.toString()) throw new AppError(StatusCodes.NOT_FOUND, 'Conflict In NearestStore');

    //         const nearbyStores = await Helper.findStoresNearUser(Number(userDefaultAddresses.latitude), Number(userDefaultAddresses.longitude));
    //         if (!nearbyStores.length) throw new AppError(StatusCodes.NOT_FOUND, 'No Store Found Near Your Address');

    //         // Optimize cart aggregation query
    //         let cartDetails = await this.cartRepository.getcartAggregation([
    //             { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    //             {
    //                 $lookup: {
    //                     from: 'userAddresses',
    //                     let: { userId: new mongoose.Types.ObjectId(userId) },
    //                     pipeline: [
    //                         { $match: { $expr: { $and: [{ $eq: ['$userId', '$$userId'] }, { $eq: ['$isDefault', true] }] } } },
    //                         { $project: { _id: 1, address1: 1, address2: 1, city: 1, state: 1, pincode: 1, country: 1, latitude: 1, longitude: 1, deliveryDetails: 1, nearestStore: 1 } }
    //                     ],
    //                     as: 'userAddressDetails'
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'products',
    //                     localField: 'productId',
    //                     foreignField: '_id',
    //                     as: 'productDetails'
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'varients',
    //                     localField: 'varientId',
    //                     foreignField: '_id',
    //                     as: 'varientDetails'
    //                 }
    //             },
    //             { $unwind: '$productDetails' },
    //             { $unwind: '$varientDetails' },
    //             { $unwind: { path: '$userAddressDetails', preserveNullAndEmptyArrays: true } },
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     quantity: 1,
    //                     productDetails: { _id: 1, thumbnail: 1, name: 1 },
    //                     varientDetails: { unit: 1, weight: 1, mrp: 1, availableQuantity: 1, storeId: 1, sellingPrice: 1 },
    //                     totalMrp: { $multiply: ['$varientDetails.mrp', '$quantity'] },
    //                     totalSellingPrice: { $multiply: ['$varientDetails.sellingPrice', '$quantity'] },
    //                     userAddressDetails: 1
    //                 }
    //             },
    //             {
    //                 $group: {
    //                     _id: '$userId',
    //                     fetchProducts: {
    //                         $push: {
    //                             _id: '$_id',
    //                             quantity: '$quantity',
    //                             productDetails: '$productDetails',
    //                             varientDetails: '$varientDetails',
    //                             totalMrp: '$totalMrp',
    //                             totalSellingPrice: '$totalSellingPrice',
    //                             notAvailable: {
    //                                 $cond: {
    //                                     if: {
    //                                         $or: [
    //                                             { $eq: ['$varientDetails.availableQuantity', 0] },
    //                                             { $ne: ['$varientDetails.storeId', new mongoose.Types.ObjectId(storeId)] }
    //                                         ]
    //                                     },
    //                                     then: true,
    //                                     else: false
    //                                 }
    //                             }
    //                         }
    //                     },
    //                     totalMaximumPrice: { $sum: '$totalMrp' },
    //                     totalSellingPrice: { $sum: '$totalSellingPrice' },
    //                     userAddressDetails: { $first: '$userAddressDetails' }
    //                 }
    //             }
    //         ]);

    //         // Check for unavailable products
    //         const unavailableProducts = cartDetails.length > 0 ? cartDetails[0].fetchProducts.filter(product => product.notAvailable) : [];
    //         if (unavailableProducts.length > 0) {
    //             throw new AppError(StatusCodes.BAD_REQUEST, 'Some Products Are Unavailable');
    //         }

    //         let priceDetails = {
    //             totalSellingPrice: cartDetails[0].totalSellingPrice,
    //             totalMaximumPrice: cartDetails[0].totalMaximumPrice,
    //         };

    //         let paymentObject = {
    //             userId: userId,
    //             storeId: storeId,
    //             products: cartDetails[0].fetchProducts,
    //             deliveryAddress: cartDetails[0].userAddressDetails,
    //         };

    //         if (cartDetails[0].userAddressDetails.nearestStore.toString() !== storeId) {
    //             let calculateDistance = await Helper.calculateDistance(
    //                 [`${storeExist?.toObject()?.coordinates.coordinates[1]},${storeExist?.toObject()?.coordinates.coordinates[0]}`],
    //                 [`${cartDetails[0].userAddressDetails?.latitude},${cartDetails[0].userAddressDetails?.longitude}`]
    //             );
    //             if (calculateDistance)
    //                 priceDetails.deliveryCharges = Helper.calculateDeliveryCharges(calculateDistance.distance.split(' ')[0]);
    //         } else {
    //             priceDetails.deliveryCharges = Helper.calculateDeliveryCharges(
    //                 cartDetails[0].userAddressDetails.deliveryDetails.distance.split(' ')[0]
    //             );
    //         }

    //         if (storeExist.isRaining || storeExist.isMidnight)
    //             priceDetails.surcharges = Helper.applySurcharge(storeExist.isRaining, storeExist.isMidnight);

    //         priceDetails.amountToPay =
    //             priceDetails.totalSellingPrice -
    //             (priceDetails.couponDiscount || 0) +
    //             priceDetails.deliveryCharges +
    //             (priceDetails.surcharges || 0);

    //         if (isCod) {
    //             paymentObject.paymentMode = 'cod';
    //             paymentObject.priceDetails = priceDetails;
    //             let createPayment = await this.repository.create(paymentObject);
    //             if (!createPayment) throw new AppError(StatusCodes.BAD_REQUEST, 'Something went wrong');
    //             await Promise.all(createPayment.products.map(async (order) => {
    //                 await this.orderRepository.create({
    //                     userId: userId,
    //                     storeId: storeId,
    //                     paymentId: createPayment._id,
    //                     products: order,
    //                     deliveryAddress: createPayment.deliveryAddress,
    //                     paymentDetails: createPayment.priceDetails,
    //                     isCode: true,
    //                     orderProgressList: [
    //                         {
    //                             status: 'Order Placed',
    //                             time: new Date()
    //                         }
    //                     ]
    //                 })
    //             }))
    //             return createPayment;
    //         } else {
    //             const order = await instance.orders.create({
    //                 amount: priceDetails.amountToPay * 100, // Amount in paise 
    //                 currency: 'INR',
    //                 receipt: `receipt_${userId}`,
    //                 payment_capture: 1
    //             });
    //             paymentObject.paymentMode = 'razorpay';
    //             paymentObject.orderId = order.id;
    //             paymentObject.priceDetails = priceDetails;
    //             let createPayment = await this.repository.create(paymentObject)
    //             return createPayment
    //         }
    //     } catch (error) {
    //         // Enhanced error handling and logging for better insights
    //         console.error('Order creation failed:', error);
    //         throw new AppError(error.statusCode, error.message, error);
    //     }
    // }

    async createOrder(userId, storeId, isCod) {
        try {
            // Use Promise.all for parallel execution
            const [userExist, storeExist, userDefaultAddresses] = await Promise.all([
                this.userRepository.getById(userId),
                this.storeRepository.getById(storeId),
                this.addressRepository.getOne({ userId: userId, isDefault: true })
            ]);

            if (!userExist) throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found');
            if (!storeExist) throw new AppError(StatusCodes.NOT_FOUND, 'Store Not Found');
            if (!userDefaultAddresses) throw new AppError(StatusCodes.NOT_FOUND, 'Default Address Not Found');
            if (userDefaultAddresses.nearestStore.toString() !== storeId.toString()) throw new AppError(StatusCodes.NOT_FOUND, 'Conflict In NearestStore');
            const nearbyStores = await Helper.findStoresNearUser(Number(userDefaultAddresses.latitude), Number(userDefaultAddresses.longitude));
            if (!nearbyStores.length) throw new AppError(StatusCodes.NOT_FOUND, 'No Store Found Near Your Address');
            const payment = await this.repository.createOrderAggregation(userId, storeId, isCod,storeExist.toObject())
            return payment
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async verifyOrder(data) {
        try {
            const payment = await this.repository.create(data)
            return payment
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }

    async getPaymentsOfUser(filter) {
        try {
            const payment = await this.repository.paymentAggregation(filter)
            return payment
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async getAllPayments(filter) {
        try {
            const payments = await this.repository.paymentAggregation(filter)
            return payments
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
}
