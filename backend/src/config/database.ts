import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_USER = process.env.DB_USER || 'mongo';
const DB_PASSWORD = process.env.DB_PASSWORD || 'rb60kgnntzywhuw3';
const DB_HOST = process.env.DB_HOST || 'shoe-factory-database-uatbqk';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'shoe_factory';

const MONGODB_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connection established successfully');
    console.log(`   Database: ${DB_NAME}`);
    console.log(`   Host: ${DB_HOST}:${DB_PORT}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;
export { mongoose };
