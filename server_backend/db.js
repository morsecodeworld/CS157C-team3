import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectToDatabase = async () => {
    const dbURI = process.env.MONGODB_URI || "";// mongo uri
    const options = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoIndex: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 500, 
    };

    mongoose.connection.on('connected', () => {
        console.log(`Mongoose connected to db`);
    });

    mongoose.connection.on('error', err => {
        console.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose connection is disconnected');
    });

    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('Mongoose connection is disconnected due to app termination');
        process.exit(0);
    });

    try {
        await mongoose.connect(dbURI, options);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectToDatabase;
