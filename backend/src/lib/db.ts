import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is missing from .env");
}


export const client = new MongoClient(uri);
export const db = client.db();


export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return mongoose.connection;
    }
    const conn = await mongoose.connect(uri);
    console.log("Mongoose connected successfully.");

    // Connect the native MongoDB client (used by Better Auth)
    await client.connect();
    console.log("MongoDB client connected successfully.");

    return conn;
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
