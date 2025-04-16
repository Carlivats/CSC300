import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("No token found in localStorage");
        return;
      }

      try {
        const response = await fetch("http://localhost:8081/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile info");
        }

        const profileData = await response.json();
        setUser({
          username: profileData.username || 'Default Username',
          profileImageUrl: profileData.profileImageUrl,
          description: profileData.description,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user.username) {
    return (
      <div>
        <h4>Log in to view this page.</h4>
      </div>
    );
  }
//background
  return (
    <div
      className="container-fluid d-flex position-relative"
      style={{
        padding: "0",
        margin: "0",
        backgroundImage:
          "url('https://www.metro.us/wp-content/uploads/2020/02/BOS_COMMUTER_RAIL_9_1-1536x1024.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      {/* Left Sidebar */}
      <div
        style={{
          position: "absolute",
          left: "0",
          top: "0",
          width: "250px",
          height: "100vh",
          backgroundColor: "#1f1f1f",
          zIndex: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "10px",
        }}
      >
        <Image
          src={user.profileImageUrl}
          alt="Profile"
          roundedCircle
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            border: "3px solid white",
            marginBottom: "10px",
          }}
        />
        <h4 style={{ color: "white", fontSize: "18px" }}>{user.username}</h4>
        <div style={{ color: "white", fontSize: "16px", marginTop: "10px" }}>
          <p>Member Since: August 2020</p>
          <p>Location: Salem, MA</p>
        </div>
        <Button
          variant="outline-light"
          onClick={() => setShow(true)}
          style={{ marginTop: "20px" }}
        >
          Log Out
        </Button>
      </div>

      {/* Description Section */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "300px",
          right: "50px",
          transform: "translateY(-50%)",
          width: "calc(100% - 350px)",
          height: "calc(100vh - 100px)",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          className="p-3 border rounded"
          style={{
            backgroundColor: "rgba(211, 211, 211, 0.9)",
            height: "100%",
            paddingTop: "20px",
          }}
        >
          <h5>Description</h5>
          <p>{user.description || "No description available."}</p>
        </div>
      </div>

      {/* Logout Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Log Out
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrivateUserProfile;
