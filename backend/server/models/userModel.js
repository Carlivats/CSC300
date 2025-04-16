const mongoose = require("mongoose");

// User schema/model
const newUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure emails are unique
      label: "email",
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Defines user roles
      default: "user", // Default role is "user"
    },
    date: {
      type: Date,
      default: Date.now,
    },
    profileImageUrl: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      default: "No Profile Description Set",
    },
  },
  { collection: "users" }
);

module.exports = mongoose.model("users", newUserSchema);
