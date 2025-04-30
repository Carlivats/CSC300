const express = require("express");
const router = express.Router();
const newUserModel = require("../models/userModel");
const mongoose = require("mongoose"); // Import mongoose

// Middleware to extract userId from JWT token
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("Authorization token required");
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.id;  // Assuming the token contains the userId
    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token");
  }
};

// Get user profile (image, description, and username)
router.get("/profile/:id?", authMiddleware, async (req, res) => {
  // Get the userId from the token or the requested profile id
  const requestedUserId = req.params.id || req.userId;

  try {
    const objectId = new mongoose.Types.ObjectId(requestedUserId); 
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
    return res.status(500).send("Server error");
  }
});

module.exports = router;
