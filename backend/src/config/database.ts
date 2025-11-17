import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_USER = 'mongo';
const DB_PASSWORD = 'canuscukc6dftf1k';
const DB_HOST = 'shoe-factory-db-nf3gx9';
const DB_PORT = '27017';
const DB_NAME = 'shoe_factory';

const MONGODB_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}?authSource=admin`;

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
