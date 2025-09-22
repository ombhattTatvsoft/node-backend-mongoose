import mongoose from 'mongoose';
import config from '../config/index.js';

const uri = config.mongo.uri;

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true}};

const connectDB = async () => {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    setTimeout(connectDB, 5000); // retry in 5s
  }
};

export default connectDB;

