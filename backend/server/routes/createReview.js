const express = require("express");
const router = express.Router();
const reviewModel = require("../models/reviewModel"); // Import Review model
const { reviewValidation } = require("../models/reviewValidator"); // Validation function (optional)

// 📌 POST - Create a Review
router.post("/createReview", async (req, res) => {
    try {
        // Validate the incoming review data (if using validation)
        const { error } = reviewValidation(req.body);
        if (error) return res.status(400).send({ message: error.errors[0].message });

        // Extract review details from request body
        const { username, comment, rating } = req.body;

        // Create a new review document
        const newReview = new reviewModel({
            username,
            comment,
            rating,
        });

        // Save the review to the database
        const savedReview = await newReview.save();

        res.status(201).send({
            message: "Review created successfully!",
            review: savedReview,
        });

    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
