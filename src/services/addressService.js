import { StatusCodes } from 'http-status-codes'
import { AddressRepository } from '../repositories/addressReposiroty.js'
import { UserRepository } from '../repositories/userReposiroty.js'
import { AppError } from '../utils/hanlders/appError.js'
import { Helper } from '../utils/helper/index.js'

export class AddressService {
    constructor() {
        this.repository = new AddressRepository()
        this.userRepository = new UserRepository()
    }
    async addAddress(data) {
        try {
            let userDetails = await this.userRepository.getById(data.userId)
            if (!userDetails) throw new AppError(StatusCodes.NOT_FOUND, 'user not found')
            let defalutAddressExist = await this.repository.getOne({ userId: userDetails._id, isDefault: true })
            if (data.latitude && data.longitude) {
                const nearestStore = await Helper.findStoresNearUser(Number(data.latitude), Number(data.longitude))
                if (!nearestStore) throw new AppError(StatusCodes.NOT_FOUND, 'no store found near you')
                let calculateDistance = await Helper.calculateDistance(
                    [nearestStore[0]?.coordinates.coordinates[1].toString() + ',' + nearestStore[0]?.coordinates.coordinates[0].toString()],
                    [data?.latitude + ',' + data?.longitude]
                )
                data.nearestStore = nearestStore[0]['_id']
                data.deliveryDetails = calculateDistance
            }
            let address = await this.repository.create({ ...data, isDefault: true })
            if (defalutAddressExist && address) {
                await this.repository.updateById(defalutAddressExist._id, { $set: { isDefault: false } })
            }
            return address
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async getAddress(addressId) {
        try {
            let addressDetails = await this.repository.getById(addressId)
            if (!addressDetails) throw new AppError(StatusCodes.NOT_FOUND, 'address not found')
            return addressDetails
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async getDefaultAddressOfUser(userId) {
        try {
            let addressDetails = await this.repository.getOne({ userId: userId, isDefault: true })
            if (!addressDetails) throw new AppError(StatusCodes.NOT_FOUND, 'no default addressfound')
            return addressDetails
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async getAllAddressOfUser(userId) {
        try {
            let allAddress = await this.repository.getAll({ userId: userId })
            return allAddress
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async updateAddress(addressId, userId, data) {
        try {
            let addressDetails = await this.repository.getOne({ _id: addressId, userId: userId })
            if (!addressDetails) throw new AppError(StatusCodes.NOT_FOUND, 'address not found')
            if (data.isDefault) {
                let defalutAddressExist = await this.repository.getOne({ userId: userId, isDefault: true })
                if (defalutAddressExist) await this.repository.updateById(defalutAddressExist._id, { $set: { isDefault: false } })
            }
            if (data.latitude && data.longitude) {
                let nearestStore = await Helper.findStoresNearUser(Number(data.latitude), Number(data.longitude))
                if (!nearestStore) throw new AppError(StatusCodes.NOT_FOUND, 'no store found near you')
                let calculateDistance = await Helper.calculateDistance(
                    [nearestStore[0]?.coordinates.coordinates[1].toString() + ',' + nearestStore[0]?.coordinates.coordinates[0].toString()],
                    [data?.latitude + ',' + data?.longitude]
                )
                data.nearestStore = nearestStore[0]['_id']
                data.deliveryDetails = calculateDistance
            }
            let updateAddressOfuser = await this.repository.updateById(addressDetails._id, data)
            if (!updateAddressOfuser) throw new AppError(StatusCodes.NOT_FOUND, 'error while update the address')
            return updateAddressOfuser
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
    async deleteAddress(addressId) {
        try {
            let addressDetails = await this.repository.getById(addressId)
            if (!addressDetails) throw new AppError(StatusCodes.NOT_FOUND, 'address not found')
            let deleteAddressOfuser = await this.repository.deleteById(addressId)
            if (addressDetails.isDefault && deleteAddressOfuser) {
                let makeDefaultAddress = await this.repository.getOne({ userId: addressDetails.userId })
                if (makeDefaultAddress) await this.repository.updateById(makeDefaultAddress._id, { $set: { isDefault: true } })
            }
            if (!deleteAddressOfuser) throw new AppError(StatusCodes.NOT_FOUND, 'error while delete the address')
            return deleteAddressOfuser
        } catch (error) {
            throw new AppError(error.statusCode, error.message, error)
        }
    }
}
