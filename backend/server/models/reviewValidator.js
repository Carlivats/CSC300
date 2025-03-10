const z = require("zod");

// Validation for creating a new review
const reviewValidation = (data) => {
  const reviewSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    comment: z.string().min(5, "Comment must be at least 5 characters long"),
    rating: z
      .number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5"),
  });

  return reviewSchema.safeParse(data);
};

module.exports.reviewValidation = reviewValidation;
