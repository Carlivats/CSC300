const express = require("express");
const router = express.Router();
const reviewModel = require("../models/reviewModel"); // Import Review model

// 📌 GET - Retrieve a Review by ID
router.get("/getReview/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract review ID from URL parameters
        
        // Find review by ID
        const review = await reviewModel.findById(id);
        
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        
        res.status(200).send({
            message: "Review retrieved successfully!",
            review,
        });
    } catch (error) {
        console.error("Error retrieving review:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
