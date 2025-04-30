const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Import the user model

// Middleware to check if the user is authenticated
const authenticateUser = async (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Make sure ACCESS_TOKEN_SECRET is in your .env file
        
        // Find the user in the database using the decoded ID
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }

        // Attach the user to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = { authenticateUser };
