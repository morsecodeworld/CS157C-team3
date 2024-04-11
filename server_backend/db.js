import mongoose from 'mongoose';

const connectToDatabase = async () => {
    try {
        mongoose.set('strictQuery', false);
        const connect = await mongoose.connect("mongodb://localhost:27017/myDatabase", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // exits with error on unsuccessful connection
    }
};

// successful connection to db
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db');
});

// Connection throws an error
mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err}`);
});

// disconnecting from db
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected');
});

// closing connection if node application ends
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection is disconnected due to app termination');
    process.exit(0);
});

export default connectToDatabase;
