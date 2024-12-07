interface Model<T> {
    create(data: any): Promise<T>
    findByIdAndDelete(id: string): Promise<T>
    deleteMany(obj: any): Promise<T>
    findById(id: string): Promise<T>
    find(filter: any): Promise<T[]>
    findOne(obj: any): Promise<T>
    findOneAndUpdate(query: any, updatedData: Partial<T>, options: any): Promise<T>
    aggregate(pipeline: any[]): Promise<any[]>
}

export class CrudRepository<T> {
    model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async create(data: any): Promise<T> {
        const response = await this.model.create(data)
        return response
    }

    async deleteById(id: string): Promise<T> {
        const response = await this.model.findByIdAndDelete(id)
        return response
    }

    async deleteMany(obj: any): Promise<T> {
        const response = await this.model.deleteMany(obj)
        return response
    }

    async getById(id: string): Promise<T> {
        const response = await this.model.findById(id)
        return response
    }

    async getAll(filter: any): Promise<T[]> {
        const response = await this.model.find(filter)
        return response
    }

    async getOne(obj: Partial<T>): Promise<T | null> {
        const response = await this.model.findOne(obj)
        return response
    }

    async updateById(id: string, updatedData: any): Promise<T> {
        const response = await this.model.findOneAndUpdate({ _id: id }, updatedData, { new: true })
        return response
    }

    async aggregate(pipeline: any[]): Promise<any[]> {
        const response = await this.model.aggregate(pipeline)
        return response
    }
}

