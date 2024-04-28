import express from 'express';
import Product from '../models/Product.js';  

const productRoutes = express.Router();

// GET request to fetch all products
const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.json({ products, pagination: {} });  // for pagination maybe
};

// POST request to add a new product
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            images: req.body.images || [], 
            brand: req.body.brand,
            category: req.body.category,
            reviews: req.body.reviews || [], 
            rating: req.body.rating || 0,
            numberOfReviews: req.body.numberOfReviews || 0,
            price: req.body.price,
            stock: req.body.stock,
            productIsNew: req.body.productIsNew
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT request to update an existing product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE request to remove a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Route definitions
productRoutes.route('/').get(getProducts).post(createProduct);
productRoutes.route('/:id').put(updateProduct).delete(deleteProduct);

export default productRoutes;
