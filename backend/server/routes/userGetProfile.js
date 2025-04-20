const express = require("express");
const router = express.Router();
const newUserModel = require("../models/userModel");
const mongoose = require("mongoose"); // Import mongoose

// Middleware to extract userId from JWT token
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("Authorization header:", req.header("Authorization"));  // Log the incoming request
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.error("No token found");
    return res.status(401).send("Authorization token required");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // Assuming the token contains the userId
    console.log("Decoded token:", decoded);  // Log decoded token data
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).send("Invalid or expired token");
  }
};
// Get user profile (image, description, and username)
router.get("/profile", authMiddleware, async (req, res) => {
  const userId = req.userId; // This comes from the token

  try {
    // Explicitly instantiate ObjectId with 'new' keyword
    const objectId = new mongoose.Types.ObjectId(userId); 

    console.log("Attempting to find user with ObjectId:", objectId);

    const user = await newUserModel.findById(objectId).select("profileImageUrl description username");

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.json({
      profileImageUrl: user.profileImageUrl,
      description: user.description,
      username: user.username,
    }); 
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return res.status(500).send("Server error");
  }
});


module.exports = router;
