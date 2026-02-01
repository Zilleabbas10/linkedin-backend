import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  if (!process.env.MONGO_URI) {
    throw new Error(
      'MONGO_URI is not set. Create a .env file in the project root with: MONGO_URI=your-mongodb-connection-string'
    );
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${conn.connection.name}`);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.log(`Error connecting to MongoDB: ${message}`);
    process.exit(1);
  }
};
