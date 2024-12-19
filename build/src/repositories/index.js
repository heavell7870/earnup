"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudRepository = void 0;
class CrudRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        const response = await this.model.create(data);
        return response;
    }
    async deleteById(id) {
        const response = await this.model.findByIdAndDelete(id);
        return response;
    }
    async deleteMany(obj) {
        const response = await this.model.deleteMany(obj);
        return response;
    }
    async getById(id) {
        const response = await this.model.findById(id);
        return response;
    }
    async getAll(filter) {
        const response = await this.model.find(filter);
        return response;
    }
    async getOne(obj) {
        const response = await this.model.findOne(obj);
        return response;
    }
    async updateById(id, updatedData) {
        const response = await this.model.findOneAndUpdate({ _id: id }, updatedData, { new: true });
        return response;
    }
    async aggregate(pipeline) {
        const response = await this.model.aggregate(pipeline);
        return response;
    }
}
exports.CrudRepository = CrudRepository;
//# sourceMappingURL=index.js.map