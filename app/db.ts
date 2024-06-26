// working before new update
import mongoose from 'mongoose';

const databaseUrl = process.env.DATABASE_URL as string;

if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
}

const connectDB = async () => {
    try {
        await mongoose.connect(databaseUrl);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

export default connectDB;






