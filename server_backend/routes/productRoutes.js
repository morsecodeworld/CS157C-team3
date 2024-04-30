import express from 'express';
import Product from '../models/Product.js';
import { body, validationResult } from 'express-validator';

const productRoutes = express.Router();

const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.json({ success: true, data: { products }, pagination: {} });
};

const validateProduct = [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    // Add more validations as necessary
];

const createProduct = [
    validateProduct,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const newProduct = new Product(req.body);
            await newProduct.save();
            res.status(201).json({ success: true, data: newProduct });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
];

const updateProduct = [
    validateProduct,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { id } = req.params;
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedProduct) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
            res.json({ success: true, data: updatedProduct });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
];

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

productRoutes.route('/').get(getProducts).post(createProduct);
productRoutes.route('/:id').put(updateProduct).delete(deleteProduct);

export default productRoutes;
