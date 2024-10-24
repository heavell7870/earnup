import { CrudRepository } from "./index.js";
import paymentModel from "../models/paymentModel.js";

export class PaymentRepository extends CrudRepository{
    constructor(){
        super(paymentModel)
    }
    async paymentAggregation(filter){
        try{
            let response = await this.model.aggregate(filter)
            return response
        } catch (error) {
            throw new AppError( error.statusCode,error.message, error);
        }
    }
}