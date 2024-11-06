import { CrudRepository } from './index.js'
import wishlistModel from '../models/wishlistModel.js'

export class WishlistRepository extends CrudRepository {
    constructor() {
        super(wishlistModel)
    }
    async getWishListAggregation(filter) {
        try {
            let response = await this.model.aggregate(filter)
            return response
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
}
