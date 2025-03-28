import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://admin:password@mongodb:27017/residential_communities?authSource=admin';
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB conectado correctamente');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

export default connectMongoDB;