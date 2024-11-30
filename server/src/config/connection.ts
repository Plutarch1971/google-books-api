import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const openDB = async (): Promise<typeof mongoose.connection> =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Database connected.');
        return mongoose.connection;
    } catch(error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed.');
    }
}
const db = openDB();

export default db;
