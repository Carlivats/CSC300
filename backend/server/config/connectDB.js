const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = () => {
  try {
    mongoose.connect(process.env.DB_URL);
    console.log("The backend has connected to the MongoDB database.");
  } catch (error) {
    console.log(`${error} could not connect`);
  }
};
module.exports = connectDB;
