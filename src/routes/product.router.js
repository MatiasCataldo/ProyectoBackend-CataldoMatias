import express from 'express';
import { saveProduct, getDatosControllers, DeleteProduct, updateProduct, getProductById } from '../controllers/product.controller.js';
import errorHandler from '../services/middlewares/index.js';

const router = express.Router();

router.get('/', getDatosControllers);

router.get('/:productId', getProductById); 

router.post("/", saveProduct);

router.put('/:productId', updateProduct); 

router.delete('/:productId', DeleteProduct);

router.use(errorHandler);

export default router;
