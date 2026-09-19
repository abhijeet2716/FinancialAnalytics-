import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/financial_dashboard';

  try {
    // Attempt connection with short timeout so server startup isn't blocked if offline
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB connected successfully to ${mongoUri}`);
    return true;
  } catch (error: any) {
    isConnected = false;
    console.warn(`[Database] MongoDB connection warning: ${error.message}`);
    console.info(`[Database] Running in-memory database fallback using transactions.json for active preview.`);
    return false;
  }
};

export const isDbConnected = (): boolean => isConnected;
