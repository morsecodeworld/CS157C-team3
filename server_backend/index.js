import dotenv from 'dotenv';
dotenv.config();

import connectToDatabase from './db.js';
import express from 'express';
import cors from 'cors';

import productRoutes from './routes/productRoutes.js';

connectToDatabase();
const app = express();
app.use(express.json());
app.use(cors({
    origin: '' 
}));

app.use('/api/products', productRoutes);

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('API is working...');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
