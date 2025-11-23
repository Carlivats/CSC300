import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import EditProfileModal from "../components/EditProfileModal";
import LogoutModal from "../components/LogoutModal";

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
        navigate("/");
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
          "url('https://arc-anglerfish-arc2-prod-bostonglobe.s3.amazonaws.com/public/C2H5U2R3SQI6TI4SR3LBLSWG2I.jpg')", // or use an external link
        backgroundSize: "cover",
        backgroundPosition: "center center",
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
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <Image
          src={user.profileImageUrl}
          alt="Profile"
          roundedCircle
          style={{
            width: "180px",
            height: "180px",
            objectFit: "cover",
            border: "4px solid white",
            marginBottom: "10px",
          }}
        />
        <h4 className="text-white text-lg font-semibold">{user.username}</h4>
        <div className="text-white text-sm mt-2 text-center">
          <p>Member Since: August 2020</p>
          <p>Location: Salem, MA</p>
        </div>

        <Button
          style={{
            marginTop: "20px",
            width: "100%",
            backgroundColor: "#6366f1", // Indigo-500
            border: "none",
          }}
          onClick={() => setEditShow(true)}
        >
          Edit Profile
        </Button>

        <Button
          style={{
            marginTop: "10px",
            width: "100%",
            backgroundColor: "#ef4444", // Red-500
            border: "none",
          }}
          onClick={() => setShow(true)}
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
          className="p-4 rounded-xl shadow-lg text-gray-800 bg-white/80 backdrop-blur"
          style={{ height: "100%" }}
        >
          <h5 className="text-2xl font-bold mb-3 text-indigo-700">
            Profile Description
          </h5>
          <p>{user.description || "No description available."}</p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        editShow={editShow}
        setEditShow={setEditShow}
        newDescription={newDescription}
        handleDescriptionChange={handleDescriptionChange}
        handleFileChange={handleFileChange}
        imageUrlInput={imageUrlInput}
        setImageUrlInput={setImageUrlInput}
        handleSaveEdit={handleSaveEdit}
      />

      {/* Logout Modal */}
      <LogoutModal show={show} setShow={setShow} handleLogout={handleLogout} />
    </div>
  );
};

export default PrivateUserProfile;
