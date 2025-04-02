import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col } from "react-bootstrap"; // Import Bootstrap components


const url = 'http://localhost:8081/reviews/getReviews';

function TrainInfo(){
    const [reviews, setReviews] = useState([]); // State to store reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.reviews) {
          setReviews(data.reviews); // Ensure we're accessing `reviews` correctly
        } else {
          console.error("Unexpected response format:", data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const renderStars = (rating) => "⭐".repeat(rating);

  return (
    <div>
      <h1>User Ratings</h1>
      <Row>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map(review => (
            <Col md={4} key={review._id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{review.username}</Card.Title>
                  <Card.Text>{renderStars(review.rating)}</Card.Text>
                  <Card.Text>"{new Date(review.date).toLocaleDateString()}"</Card.Text>
                  <Card.Footer className="text-muted">
                  {review.comment}
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
}

export default TrainInfo;
