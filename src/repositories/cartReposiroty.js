import { CrudRepository } from "./index.js";
import cartModel from '../models/cartModel.js'

export class CartRepository extends CrudRepository{
    constructor(){
        super(cartModel)
    }
    async getcartAggregation(filter){
        try{
            let response = await this.model.aggregate(filter)
            return response
        } catch (error) {
            throw new AppError( error.statusCode,error.message, error);
        }
    }
}