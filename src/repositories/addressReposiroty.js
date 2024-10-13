import { CrudRepository } from "./index.js";
import addressModel from '../models/addressModel.js'

export class AddressRepository extends CrudRepository{
    constructor(){
        super(addressModel)
    }
}