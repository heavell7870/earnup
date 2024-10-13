import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({})
const varientSchema = new mongoose.Schema({})

const productModel = mongoose.model('products', productSchema, 'products')
const varientModel = mongoose.model('varients', varientSchema, 'varients')

export { productModel, varientModel }