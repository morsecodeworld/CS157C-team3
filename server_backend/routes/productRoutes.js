import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Route for creating a new product
router.post('/', createProduct);

// Route for retrieving all products
router.get('/', getProducts);

// Route for retrieving a single product by ID
router.get('/:id', getProductById);

// Route for updating a product by ID
router.put('/:id', updateProduct);

// Route for deleting a product by ID
router.delete('/:id', deleteProduct);

export default router;
