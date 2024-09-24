// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    //await mongoose.connect("mongodb://0.0.0.0:27017/");
    await mongoose.connect("mongodb+srv://yusufsolak98:qyqk3Z-Juu#yw!@@cluster0.f500k.mongodb.net/");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
