const express = require("express");
const router = express.Router();
const Review = require("../models/reviewModel"); // Import Review model
const { reviewValidation } = require("../models/reviewValidator"); // Validation function (optional)
const { authenticateUser } = require("../middleware/authMiddleware");

// 📌 POST - Create a Review
router.post("/createReview", authenticateUser, async (req, res) => {
    try {
        // Extract review details from request body
        const { comment, rating } = req.body;

        if (!comment || !rating) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newReview = new Review({
            username: req.user.username,
            comment,
            rating,
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Failed to create review" });
    }
});

module.exports = router;
