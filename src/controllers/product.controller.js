import { ProductService, UserService } from '../services/service.js';
import { generateProduct } from '../utils.js';
import CustomProductError from "../services/error/CustomError.js";
import { ProductErrors } from "../services/error/errors-enum.js";
import { generateProductErrorInfo } from "../services/messages/product-creation-error.message.js";

// GUARDAR PRODUCTO
export const saveProduct = async (req, res) => {
    try {
        const { id, title, description, price, thumbnail, stock, category, owner } = req.body;

        if (!id || !title || !description || !price || !thumbnail || !stock || !category) {
            CustomProductError.createError({
                name: "Product Create Error",
                cause: generateProductErrorInfo({ id, title, description, price, thumbnail, stock, category }),
                message: "Error al intentar crear el producto",
                code: ProductErrors.MISSING_REQUIRED_FIELDS
            });
        }

        const defaultOwnerId = '66344214c74edb38fa6ab69a';

        const productDto = {
            id,
            title,
            description,
            price,
            thumbnail,
            stock,
            category,
            owner: owner || defaultOwnerId
        };

        await ProductService.create(productDto);
        res.status(201).send({ status: "success", payload: productDto });

    } catch (error) {
        console.error(error.cause);
        res.status(500).send({ error: error.code, message: error.message });
    }
};


//OBTENER PRODUCTOS
export const getProducts = async (rq, res) => {
    try {
        let products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateProduct());
        }
        res.send({ status: "success", payload: products });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los productos" });
    }
};

export const getDatosControllers = async (req, res) => {
    try {
        const datos = await ProductService.getAll({}).sort({ code: 1 });
        res.status(200).json(datos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
}

export const postDatosControllers = async (req, res) => {
    let dato = req.body;
    await ProductService.createProduct(dato);
    res.json({ dato })
}

// BORRAR PRODUCTO
export const DeleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const deletedProduct = await ProductService.delete(productId);
        if (!deletedProduct) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.status(200).json({ message: 'Producto eliminado correctamente', deletedProduct });
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};


// ACTUALIZAR PRODUCTO
export const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const updateData = req.body;
    try {
        const updatedProduct = await ProductService.update(productId, updateData);

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto actualizado correctamente', updatedProduct });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await ProductService.getById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};