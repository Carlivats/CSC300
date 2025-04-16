import React, { useState} from "react";

function CommentBox({ onSubmit }) {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment && rating) {
            onSubmit({ comment, rating});
            setComment("");
            setRating(5);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            className="form-control mb-2"
            rows="3"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <select
            className="form-select mb-2"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} Star{num > 1 && "s"}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">Submit Review</button>
        </form>
      );
}

export default CommentBox;