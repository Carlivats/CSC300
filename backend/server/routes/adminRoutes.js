const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const isAdmin = require("../middleware/isAdmin");
const { authenticateUser } = require("../middleware/authMiddleware"); // Ensure authentication

// Delete a user (admin only)
router.delete("/delete-user/:id", authenticateUser, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user." });
    }
});

module.exports = router;
