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

// 📌 GET - Fetch a Review by ID
router.get("/getReviewById", async (req, res) => {
    try {
        const { reviewId } = req.body; // Get review ID from request body

        if (!reviewId) {
            return res.status(400).send({ message: "Review ID is required" });
        }

        const review = await reviewModel.findById(reviewId);

        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }

        res.status(200).send(review);
    } catch (error) {
        console.error("Error fetching review:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// 📌 DELETE - Remove All Reviews
router.post("/deleteAllReviews", async (req, res) => {
    try {
        await reviewModel.deleteMany({}); // Delete all review records

        res.status(200).send({ message: "All reviews deleted successfully!" });
    } catch (error) {
        console.error("Error deleting reviews:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
