const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const base =
      process.env.MONGODB_URI || process.env.MONGO_URI;
    const dbName = process.env.MONGODB_DB;
    if (!base) {
      throw new Error("Set MONGODB_URI (or MONGO_URI) in the environment");
    }
    const uri = dbName ? `${base.replace(/\/$/, "")}/${dbName}` : base;
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.name}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;