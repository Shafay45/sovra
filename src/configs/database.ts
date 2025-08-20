import mongoose from "mongoose";

require("dotenv").config();

export const connectDB = async () => {
  try {
    const url = process.env.MONGOOSE_URL!;
    const conn = await mongoose.connect(url);
    console.log(`MongoDB Connected`);
  } catch (error: any) {
    process.exit(1);
  }
};
