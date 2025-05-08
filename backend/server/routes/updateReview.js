const express = require("express");
const router = express.Router();
const reviewModel = require("../models/reviewModel"); // Import Review model
const { authenticateUser } = require("../middleware/authMiddleware"); // Import authentication

// 📌 PUT - Update a Review - Admin can update any review
router.put("/updateReview/:id", authenticateUser, async (req, res) => { 
    try {
        const { id } = req.params; // Extract review ID from URL parameters
        const { comment, rating } = req.body; // Extract review details from request body
        
        // Check if user is admin (username === 'admin13')
        const isAdmin = req.user.username === 'admin13';
        
        // Fetch the review to verify ownership
        const review = await reviewModel.findById(id);
        
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        
        // Only allow update if user is admin or the review belongs to the user
        if (!isAdmin && review.username !== req.user.username) {
            return res.status(403).send({ message: "You can only edit your own reviews" });
        }

        // Update the review - keep original username
        const updatedReview = await reviewModel.findByIdAndUpdate(
            id,
            { comment, rating },
            { new: true, runValidators: true } // Returns the updated document and runs validation
        );
        
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
