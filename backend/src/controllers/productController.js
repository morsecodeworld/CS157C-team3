import Product from '../src/models/Product.js.js.js';

// Create a new product
export const createProduct = async (req, res) => {
    const { name, images, brand, category, reviews, rating, numberOfReviews, price, stock, productIsNew, stripeId } = req.body;
    try {
        const newProduct = new Product({
            name, images, brand, category, reviews, rating, numberOfReviews, price, stock, productIsNew, stripeId
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error: error.message });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Get a single product by id
export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id).populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

// Update a product by id
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, images, brand, category, reviews, rating, numberOfReviews, price, stock, productIsNew, stripeId } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name, images, brand, category, reviews, rating, numberOfReviews, price, stock, productIsNew, stripeId
        }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product by id
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
