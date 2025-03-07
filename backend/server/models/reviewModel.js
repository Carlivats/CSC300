const mongoose = require("mongoose");

// Review schema/model
const reviewSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    comment: {
      type: String,
      required: true,
      label: "comment",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      label: "rating",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "reviews" }
);

module.exports = mongoose.model("reviews", reviewSchema);
