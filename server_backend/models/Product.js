const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    images: [{ url: String, alt: String }],
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numberOfReviews: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    productIsNew: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
