import { StatusCodes } from 'http-status-codes'
import { PaymentRepository } from '../repositories/paymentReposiroty.js'
import { CartRepository } from '../repositories/cartReposiroty.js'
import { UserRepository } from '../repositories/userReposiroty.js'
import { ProductRepository } from '../repositories/productRepository.js'
import { VarientRepository } from '../repositories/productRepository.js'
import { AppError } from '../utils/hanlders/appError.js'
import mongoose from 'mongoose'

export class CartService {
    constructor() {
        this.repository = new PaymentRepository()
        this.cartRepository = new CartRepository()
        this.userRepository = new UserRepository()
        this.productRepository = new ProductRepository()
        this.varientRepository = new VarientRepository()
    }
}
