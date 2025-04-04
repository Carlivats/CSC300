const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { newUserValidation } = require("../models/userValidator");
const newUserModel = require("../models/userModel");

router.post("/signup", async (req, res) => {
    const { error } = newUserValidation(req.body);
    if (error) return res.status(400).send({ message: error.errors[0].message });

    const { username, email, password, isAdmin } = req.body; // Accept isAdmin from request body

    // Check if username already exists
    const user = await newUserModel.findOne({ username: username });
    if (user) return res.status(409).send({ message: "Username is taken, pick another" });

    // Generate hash for the password
    const generateHash = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, generateHash);

    // Determine the role (admin only if explicitly allowed)
    const role = isAdmin ? "admin" : "user";

    // Create a new user
    const createUser = new newUserModel({
        username: username,
        email: email,
        password: hashPassword,
        role: role, // Assign role
    });

    try {
        const saveNewUser = await createUser.save();
        res.send(saveNewUser);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create new user" });
    }
});

module.exports = router;
