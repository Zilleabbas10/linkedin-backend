import mongoose from 'mongoose';
import { config } from './config';

export const connectDB = async (): Promise<void> => {
  if (!config.mongoUri) {
    throw new Error(
      'MONGO_URI is not set. Create a .env file in the project root with: MONGO_URI=your-mongodb-connection-string'
    );
  }
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`Connected to MongoDB: ${conn.connection.name}`);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(`Error connecting to MongoDB: ${message}`);
    process.exit(1);
  }
};
