const express = require("express");
const router = express.Router();
const reviewModel = require("../models/reviewModel"); // Import Review model
const { reviewValidation } = require("../models/reviewValidator"); // Validation function

// 📌 PUT - Create a Review
router.put("/updateReview/:id", async (req, res) => {
    try {
        // Validate the incoming review data
        const { error } = reviewValidation(req.body);
        if (error) return res.status(400).send({ message: error.errors[0].message });

        const { id } = req.params; // Extract review ID from URL parameters
        const { username, comment, rating } = req.body; // Extract review details from request body

        // Find and update the review
        const updatedReview = await reviewModel.findByIdAndUpdate(
            id,
            { username, comment, rating },
            { new: true, runValidators: true } // Returns the updated document and runs validation
        );

        if (!updatedReview) {
            return res.status(404).send({ message: "Review not found" });
        }
        
        res.status(200).send({
            message: "Review updated successfully!",
            review: updatedReview,
        });

    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
