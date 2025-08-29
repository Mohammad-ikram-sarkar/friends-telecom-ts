import mongoose from "mongoose";

export const connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
  
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("✅ MongoDB Connected");
    });

    connection.on("error", (err) => {
      console.error("❌ MongoDB connection error: " + err);
      process.exit(1);
    });

    return conn;
  } catch (err) {
    console.error("❌ Something went wrong while connecting to DB:", err);
    throw err;
  }
};
