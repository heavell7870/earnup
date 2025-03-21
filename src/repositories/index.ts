import { Document, Model as MongooseModel, ObjectId } from 'mongoose'

export class CrudRepository<T> {
    model: MongooseModel<T & Document>

    constructor(model: MongooseModel<T & Document>) {
        this.model = model
    }

    async create(data: Partial<T>): Promise<T> {
        const response = await this.model.create(data)
        return response as unknown as T
    }

    async deleteById(id: string): Promise<T> {
        const response = await this.model.findByIdAndDelete(id)
        return response as unknown as T
    }

    async deleteMany(obj: Partial<T>): Promise<T> {
        const response = await this.model.deleteMany(obj as any)
        return response as unknown as T
    }

    async getById(id: ObjectId): Promise<T> {
        const response = await this.model.findById(id)
        return response as unknown as T
    }

    async getAll(filter: any, pagination?: { page?: number; limit?: number }, sort?: { [key: string]: 1 | -1 }): Promise<T[]> {
        let query = this.model.find(filter)

        if (pagination) {
            const page = pagination.page || 1
            const limit = pagination.limit || 10
            const skip = (page - 1) * limit

            query = query.skip(skip).limit(limit)
        }

        if (sort) {
            query = query.sort(sort)
        }

        const response = await query
        return response as unknown as T[]
    }

    async getOne(obj: Partial<T>): Promise<T | null> {
        const response = await this.model.findOne(obj as any)
        return response as unknown as T | null
    }

    async updateById(id: string, updatedData: any, options: { upsert?: boolean; new?: boolean } = { upsert: false, new: true }): Promise<T> {
        const response = await this.model.findOneAndUpdate({ _id: id }, updatedData, options)
        return response as unknown as T
    }

    async aggregate(pipeline: any[]): Promise<any[]> {
        const response = await this.model.aggregate(pipeline).exec()
        return response
    }
}

