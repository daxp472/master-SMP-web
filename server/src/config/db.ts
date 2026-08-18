import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB(): Promise<typeof mongoose> {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`[MongoDB] Connected to database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error("[MongoDB] Connection error:", error);
    // Don't kill process immediately in dev so app can start gracefully if mongo isn't running yet
    throw error;
  }
}
