import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [user, setUser] = useState({});
  const [newDescription, setNewDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState("");

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
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch profile info");

        const profileData = await response.json();
        setUser({
          username: profileData.username || "Default Username",
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

  // Handle description input change
  const handleDescriptionChange = (e) => {
    setNewDescription(e.target.value);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      setSelectedFile(file); // Store the file in state
    }
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      console.error("No token found.");
      return;
    }
  
    let response;
  
    try {
      if (selectedFile) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append("description", newDescription);
        formData.append("profileImage", selectedFile); // Matches backend field name
  
        response = await fetch("http://localhost:8081/user/editProfile", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type manually for FormData
          },
          body: formData,
        });
      } else {
        // Use JSON for text and image URL submission
        const jsonBody = {
          description: newDescription,
        };
  
        if (imageUrlInput.trim()) {
          jsonBody.profileImageUrl = imageUrlInput.trim();
        }
  
        response = await fetch("http://localhost:8081/user/editProfile", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonBody),
        });
      }
  
      if (!response.ok) throw new Error("Failed to update profile");
  
      const data = await response.json();
      setUser((prevUser) => ({
        ...prevUser,
        description: data.description,
        profileImageUrl: data.profileImageUrl,
      }));
  
      setEditShow(false);
      setNewDescription("");
      setImageUrlInput("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile.");
    }
  };
  
  
  

  if (!user.username) {
    return <div><h4>Log in to view this page.</h4></div>;
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
      {/* Sidebar */}
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
          variant="primary"
          onClick={() => setEditShow(true)}
          style={{ marginTop: "20px", width: "100%" }}
        >
          Edit Profile
        </Button>

        <Button
          variant="danger"
          onClick={() => setShow(true)}
          style={{ marginTop: "10px", width: "100%" }}
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

      {/* Edit Profile Modal */}
      <Modal show={editShow} onHide={() => setEditShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label>Description</label>
              <textarea
                className="form-control"
                value={newDescription}
                onChange={handleDescriptionChange}
                rows="3"
              />
            </div>

            <div className="mb-3">
              <label>Upload New Profile Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="mb-3">
              <label>Or Enter Image URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://example.com/image.jpg"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

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
