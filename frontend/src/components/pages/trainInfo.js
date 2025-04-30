import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import CommentBox from "../commentBox";

const url = 'http://localhost:8081/reviews/getReviews';

function TrainInfo() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(5);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.reviews) {
          setReviews(data.reviews);
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

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  const averageRating = calculateAverageRating();

  const handleReviewSubmit = async ({ comment, rating }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch('http://localhost:8081/reviews/createReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ comment, rating }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const data = await response.json();
      console.log("Review submitted:", data);

      // Push new review to top of list
      setReviews(prev => [data, ...prev]);
    } catch (error) {
      console.error("Error submitting review:", error.message);
    }
  };

  const loadMoreReviews = () => {
    const newReviwesNumber = 10;
    setVisibleReviews(prev => prev + newReviwesNumber);
  };

  return (
    <Container>
      <h1>User Ratings</h1>

      {/* Overall Rating Card */}
      <Card>
        <Card.Body>
          <Card.Title>Overall Rating</Card.Title>
          <Card.Text className="overall-stars">
            {averageRating > 0 ? renderStars(Math.round(averageRating)) : "No ratings yet"} ({averageRating.toFixed(1)}/5)
          </Card.Text>
        </Card.Body>
      </Card>

      <CommentBox onSubmit={handleReviewSubmit} />

      <div className="review-container">
        <Row className="d-flex flex-column align-items-center">
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.slice(0, visibleReviews).map(review => (
              <Col md={6} key={review._id} className="mb-3">
                <Card className="review-card">
                  <Card.Body>
                    <img
                      src={review.profilePic || "https://via.placeholder.com/40"}
                      alt={review.username}
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                    />
                    <div>
                      <Card.Title>{review.username}</Card.Title>
                      <Card.Text>{renderStars(review.rating)}</Card.Text>
                      <Card.Text>"{review.comment}"</Card.Text>
                      <Card.Footer className="text-muted">
                        {new Date(review.date).toLocaleDateString()}
                      </Card.Footer>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>

      {visibleReviews < reviews.length && (
        <div className="text-center mt-3">
          <Button variant="primary" onClick={loadMoreReviews}>
            Load More Reviews
          </Button>
        </div>
      )}
    </Container>
  );
}

export default TrainInfo;
