import mongoose from 'mongoose'

const connectDB = async()=> {

    try {
        await mongoose.connect(process.env.MONGODB_URI);

        mongoose.connection.on('connected', () => {
            console.log("DB CONNECTED");
        });

        mongoose.connection.on('error', (err) => {
            console.error('DB Error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('DB Disconnected');
        });

        console.log(`Database: ${mongoose.connection.name || 'airbnb_clone'}`);
        console.log(`Host: ${mongoose.connection.host}`);

    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;