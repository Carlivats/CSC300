import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import getUserInfo from "../../utilities/decodeJwt";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user || !user.username) {
    return (
      <div>
        <h4>Log in to view this page.</h4>
      </div>
    );
  }

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
      {/* Left-Side Profile Banner */}
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
          alignItems: "center", // Center items in the sidebar
          justifyContent: "flex-start", // Ensure content is aligned to the top
          padding: "10px", // Padding for the content
        }}
      >
        <ProfilePicture imageUrl={user.profilePicture} />
        <Username name={user.username} />

        {/* New Text Lines */}
        <div style={{ color: "white", fontSize: "16px", marginTop: "10px" }}>
          <p>Member Since: August 2020</p>
          <p>Location: Salem, MA</p>
        </div>

        <ProfileButtons onLogout={() => setShow(true)} />
      </div>

      {/* Right Section - Description Box */}
      <div
        style={{
          position: "absolute", // Ensure it’s positioned absolutely
          top: "50%",
          left: "300px", // 300px from the left side
          right: "50px", // 50px from the right side
          transform: "translateY(-50%)", // Center vertically
          width: "calc(100% - 350px)", // Remaining space between the left (300px) and right (50px) side
          height: "calc(100vh - 100px)", // Ensure it takes most of the height
          padding: "20px",
          boxSizing: "border-box", // Prevent box from overflowing the container
        }}
      >
        <div
          className="p-3 border rounded"
          style={{
            backgroundColor: "rgba(211, 211, 211, 0.9)",
            height: "100%", // Make sure it fills up the vertical space of the box
            paddingTop: "20px",
            paddingBottom: "20px",
            overflowY: "auto", // Make content scrollable if it overflows
            fontSize: "26px",
            fontFamily: "Arial",
            lineHeight: "1.6",
          }}
        >
          {user.description || "Hi, I am Tim, and I am from Salem, Massachusetts — a town known for its rich history and spooky legends, but for me, it is all about trains. I have been fascinated by locomotives since I was a kid. Growing up near the railroad tracks, I was always captivated by the sound and power of the trains passing through Salem. There is something magical about watching them glide down the tracks, carrying with them the promise of distant places. My love for trains goes beyond just watching them; I am deeply fascinated by their history. Trains played a pivotal role in shaping our nations growth, and I love learning about their evolution — from the early steam engines to the modern high-speed rail systems. I find it incredible how trains have connected cities and cultures, and how they continue to symbolize progress and adventure. Whether I am snapping photos of vintage locomotives or simply enjoying the sound of a train whistle on a quiet afternoon, trains have always been a central part of my life. They are more than just machines to me — they are a connection to the past, and a constant source of inspiration."}
        </div>
      </div>

      {/* Logout Modal */}
      <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Log Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Profile Picture Component
const ProfilePicture = ({ imageUrl }) => {
  return (
    <Image
      src={imageUrl || "https://i.imgur.com/wR4o0WE.png"}
      roundedCircle
      width="200"
      height="200"
      alt="Profile"
      className="mb-3"
    />
  );
};

// Username Component
const Username = ({ name }) => {
  return <h2 className="text-center" style={{ color: "white" }}>{name}</h2>;
};

// Profile Buttons Component
const ProfileButtons = ({ onLogout }) => {
  return (
    <div
      className="d-flex flex-column w-100 mt-4"
      style={{
        position: "absolute", // Position absolute to stick to the bottom of the sidebar
        bottom: "10px", // Adjust to create some spacing from the bottom
        left: "10px",
      }}
    >
      <Button
        className="mt-2"
        variant="secondary"
        style={{
          width: "230px",
          padding: "10px",
          fontSize: "20px",
          borderRadius: "25px",
        }}
      >
        Edit Profile
      </Button>
      <Button
        className="mt-2"
        variant="danger"
        style={{
          width: "230px",
          padding: "10px",
          fontSize: "20px",
          borderRadius: "25px",
        }}
        onClick={onLogout}
      >
        Log Out
      </Button>
    </div>
  );
};

export default PrivateUserProfile;
