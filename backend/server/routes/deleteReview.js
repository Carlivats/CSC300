const express = require("express");
const router = express.Router();
const reviewModel = require("../models/reviewModel"); // Import Review model
const isAdmin = require("../middleware/isAdmin"); // Import admin check
const { authenticateUser } = require("../middleware/authMiddleware"); // Import authentication

// 📌 DELETE - Remove a Review by ID (Admin only)
router.delete("/deleteReview/:id", authenticateUser, isAdmin, async (req, res) => {
    try {
        const { id } = req.params; // Extract review ID from URL parameters
        
        // Find and delete the review
        const deletedReview = await reviewModel.findByIdAndDelete(id);
        
        if (!deletedReview) {
            return res.status(404).send({ message: "Review not found" });
        }
        
        res.status(200).send({
            message: "Review deleted successfully!",
            review: deletedReview,
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
