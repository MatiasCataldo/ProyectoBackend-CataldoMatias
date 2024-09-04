import GenericRepository from "./GenericRepository.js";
import ProductModel from "../dao/models/product.model.js";

export default class ProductRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    update = async (productId, updateData) => {
        return await ProductModel.findByIdAndUpdate(productId, updateData, { new: true });
    };

    getById = async (productId) => {
        return ProductModel.findById(productId); 
    }

}