import dotenv from 'dotenv'; 
dotenv.config();

import connectToDatabase from './db.js'; 
import express from 'express'; // for express server
import cors from 'cors'; // allow the broswer to talk to different ports

// Routes
import productRoutes from './routes/productRoutes.js';

connectToDatabase();
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/products', productRoutes);

//localhost:3000/api/products
const port = 3000;


//schema is located at /models/Product.js


app.get('/', (req, res) => {
    res.send('API is working...');
});

app.listen(port, () => {
    console.log(`This server is running on port ${port}`);
});
