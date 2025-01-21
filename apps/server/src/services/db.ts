import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  console.log("MONGODB connection string: ", process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("Database connected successfully.");
  } catch (error: Error | any) {
    console.log("Database connection failed.", error);
    process.exit(1);
  }
};

export default connectDB;
