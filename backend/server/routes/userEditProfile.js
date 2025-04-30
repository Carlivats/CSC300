const express = require("express");
const router = express.Router();
const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3"); 
const newUserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");


// Multer setup (optional now)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});


// JWT auth middleware
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.id || decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).send("Invalid or expired token.");
  }
};

// Allow both JSON and multipart/form-data
router.post("/editProfile", authenticateToken, upload.single("profileImage"), async (req, res) => {
  const userId = req.userId;

  // Allow parsing description from either form-data or JSON
  const description = req.body.description;
  let profileImageUrl = req.body.profileImageUrl || null;

  // If a file was uploaded, upload to S3 and use that URL instead
  if (req.file) {
    const fileExtension = req.file.mimetype.split("/")[1];
    const fileName = `profile-images/${userId}-${Date.now()}.${fileExtension}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    try {
      console.log("Uploading image to S3...");
      await s3.send(new PutObjectCommand(uploadParams));
      profileImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      console.log("Image uploaded successfully:", profileImageUrl);
    } catch (err) {
      console.error("Error uploading image:", err);
      return res.status(500).send("Error uploading image to S3");
    }
  }

  // Update the user's data in the DB
  try {
    const updatedUser = await newUserModel.findByIdAndUpdate(
      userId,
      {
        profileImageUrl: profileImageUrl || undefined,
        description: description || undefined
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    return res.json({
      message: "Profile updated successfully",
      profileImageUrl: updatedUser.profileImageUrl,
      description: updatedUser.description
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
