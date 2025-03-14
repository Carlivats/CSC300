const express = require("express");
const router = express.Router();
const reviewModel = require("../models/reviewModel"); // Import Review model

// 📌 GET - Retrieve All Reviews
router.get("/getReviews", async (req, res) => {
    try {
        // Find all reviews
        const reviews = await reviewModel.find();
        
        res.status(200).send({
            message: "Reviews retrieved successfully!",
            reviews,
        });
    } catch (error) {
        console.error("Error retrieving reviews:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
