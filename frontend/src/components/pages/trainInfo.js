import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Card, Container, Row, Col, Button, Alert } from "react-bootstrap"; // Import Bootstrap components
import CommentBox from "../commentBox";

const url = 'http://localhost:8081/reviews/getReviews';

function TrainInfo() {
  const [reviews, setReviews] = useState([]); // State to store reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(5);

  // Add a function to check login status that can be called multiple times
  const checkLoginStatus = () => {
    const accessToken = localStorage.getItem("accessToken");
    const guestUser = localStorage.getItem("guestUser");
    const username = localStorage.getItem("username");
    const isAuth = !!accessToken && !guestUser;
    
    // Check if user is admin (username is admin13)
    const adminStatus = username === "admin13" && isAuth; // Only set admin if authenticated
    
    setIsLoggedIn(isAuth);
    setIsAdmin(adminStatus);
    
    console.log("Auth Debug:", { 
      accessToken: accessToken ? "exists" : "none", 
      guestUser: guestUser ? "true" : "false",
      username: username || "none",
      isAdmin: adminStatus,
      isAuthenticated: isAuth 
    });
    return isAuth;
  };

  // Function to fetch reviews
  const fetchReviews = () => {
    setLoading(true);
    fetch(url)
      .then(response => {
        console.log("Reviews API Response Status:", response.status);
        return response.json();
      })
      .then(data => {
        console.log("Reviews Data:", data);
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
  };

  useEffect(() => {
    // Check if user is logged in
    checkLoginStatus();
    fetchReviews();

    // Set up storage event listener to detect changes to localStorage
    const handleStorageChange = () => {
      checkLoginStatus();
      fetchReviews();
    };
    
    // Listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for our custom auth change event (from same tab)
    window.addEventListener('authChange', handleStorageChange);
    
    // Add a function to check auth when the page gains focus
    const handleFocus = () => {
      checkLoginStatus();
      fetchReviews();
    };
    
    // Check auth status when window gains focus (user returns to the tab)
    window.addEventListener('focus', handleFocus);
    
    // Immediately check auth on mount
    handleFocus();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Function to generate Stars
  const renderStars = (rating) => "⭐".repeat(rating);

  //Funtion to calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  }

  const averageRating = calculateAverageRating();

  const handleReviewSubmit = async ({ comment, rating }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log("accessToken:", localStorage.getItem("accessToken"));

      const response = await axios.post(
        "http://localhost:8081/reviews/createReview",
        { comment, rating },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Review submitted:", response.data);
      // Refresh the page to show the new review
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error.response?.data || error.message);
      // Show error to user
    }
  };

  // Function to delete a review
  const handleDeleteReview = async (reviewId) => {
    if (!isAdmin) return;
    
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      await axios.delete(
        `http://localhost:8081/reviews/deleteReview/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      // Refresh reviews
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error.response?.data || error.message);
    }
  };

  // Function to start editing a review
  const handleEditReview = (review) => {
    setEditingReview(review._id);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
  };

  // Function to save edited review
  const handleSaveEdit = async () => {
    if (!editingReview || !isAdmin) return;
    
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      await axios.put(
        `http://localhost:8081/reviews/updateReview/${editingReview}`,
        {
          comment: editedComment,
          rating: editedRating
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      // Reset editing state
      setEditingReview(null);
      setEditedComment("");
      setEditedRating(5);
      
      // Refresh reviews
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error.response?.data || error.message);
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditedComment("");
    setEditedRating(5);
  };

  // Function to Load More Reviews
  const loadMoreReviews = () => {
    const newReviwesNumber = 10
    setVisibleReviews(prev => prev + newReviwesNumber);
  }

  // Display all reviews for testing purposes
  const displayReviews = reviews.slice(0, visibleReviews).map(review => (
    <Col md={6} key={review._id} className="mb-3">
      <Card className="review-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex">
              <img
                src={review.profilePic || "https://via.placeholder.com/40"}
                alt={review.username}
                className="rounded-circle me-3"
                width="40"
                height="40"
              />
              <div>
                <Card.Title>{review.username}</Card.Title>
                {editingReview === review._id ? (
                  <>
                    <select 
                      className="form-select mb-2" 
                      value={editedRating} 
                      onChange={(e) => setEditedRating(parseInt(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Star{num > 1 && "s"}</option>
                      ))}
                    </select>
                    <textarea 
                      className="form-control mb-2"
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      rows="3"
                    ></textarea>
                    <div className="mt-2">
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={handleSaveEdit} 
                        className="me-2"
                      >
                        Save
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Card.Text>{renderStars(review.rating)}</Card.Text>
                    <Card.Text>"{review.comment}"</Card.Text>
                    <Card.Footer className="text-muted">
                      {new Date(review.date).toLocaleDateString()}
                    </Card.Footer>
                  </>
                )}
              </div>
            </div>
            {isAdmin && editingReview !== review._id && (
              <div>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2" 
                  onClick={() => handleEditReview(review)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => handleDeleteReview(review._id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  ));

  return (
    <Container>
      <h1>User Ratings</h1>

      {isAdmin && (
        <Alert variant="info" className="mt-3 mb-3">
          <Alert.Heading>Admin Mode</Alert.Heading>
          <p>
            You are logged in as an administrator. You can edit or delete user reviews, but cannot add new reviews.
          </p>
        </Alert>
      )}

      {/* Overall Rating Card */}
      <Card>
        <Card.Body>
          <Card.Title>Overall Rating</Card.Title>
          <Card.Text className="overall-stars">
            {renderStars(averageRating)} ({averageRating.toFixed(1)}/5)
          </Card.Text>
        </Card.Body>
      </Card>

      {isLoggedIn && !isAdmin ? (
        <CommentBox onSubmit={handleReviewSubmit} />
      ) : !isLoggedIn ? (
        <Alert variant="info" className="mt-3">
          <Alert.Heading>Want to leave a review?</Alert.Heading>
          <p>
            You need to be logged in to leave reviews. <a href="/login">Log in</a> or <a href="/signup">create an account</a> to participate.
          </p>
        </Alert>
      ) : null}

      <div className="review-container">
        <h2 className="my-3">Reviews</h2>
        
        <Row className="d-flex flex-column align-items-center">
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <>
              {!isLoggedIn ? (
                <Alert variant="warning" className="mb-3 w-100">
                  <p className="mb-0">
                    You're viewing MBTA in guest mode. <a href="/login">Log in</a> or <a href="/signup">sign up</a> to see user reviews.
                  </p>
                </Alert>
              ) : (
                displayReviews
              )}
            </>
          )}
        </Row>
      </div>

      {/* Show "Load More" button only if there are more reviews to load and user is logged in */}
      {isLoggedIn && visibleReviews < reviews.length && (
        <div className="text-center mt-3">
          <Button variant="primary" onClick={loadMoreReviews}>
            Load More Reviews
          </Button>
        </div>
      )}
      
      {/* Temporary debug button - remove in production */}
      <div className="text-center mt-4 mb-3">
        <Button 
          variant="link" 
          size="sm" 
          onClick={() => {
            checkLoginStatus();
            fetchReviews();
          }}
        >
          Refresh Auth Status
        </Button>
      </div>
    </Container>
  );
}

export default TrainInfo;
