import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const PRIMARY_COLOR = "#6366f1";
const SECONDARY_COLOR = "#1f1f1f";
const LIGHT_COLOR = "#ffffff";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/signup`;

const Register = () => {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Light Mode");

  const navigate = useNavigate();

  const labelStyling = {
    color: PRIMARY_COLOR,
    fontWeight: "600",
  };
  const backgroundStyling = {
    backgroundColor: bgColor,
    transition: "background-color 0.3s ease",
  };
  const buttonStyling = {
    backgroundColor: PRIMARY_COLOR,
    border: "none",
    color: LIGHT_COLOR,
    fontWeight: "bold",
  };

  useEffect(() => {
    if (light) {
      setBgColor(LIGHT_COLOR);
      setBgText("Dark Mode");
    } else {
      setBgColor(SECONDARY_COLOR);
      setBgText("Light Mode");
    }
  }, [light]);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First, register the user
      await axios.post(url, data);
      
      // Then, immediately log them in to get the token
      const loginUrl = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`;
      const loginData = { 
        username: data.username,
        password: data.password
      };
      
      const loginResponse = await axios.post(loginUrl, loginData);
      
      if (loginResponse.data.accessToken) {
        localStorage.setItem("accessToken", loginResponse.data.accessToken);
        localStorage.removeItem("guestUser"); // Ensure not in guest mode
        navigate("/mbtaLayout");
      } else {
        // If login fails, redirect to login page
        navigate("/login");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <section className="vh-100 d-flex align-items-center" style={backgroundStyling}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 bg-white p-5 rounded-4 shadow">
            <h2 className="text-center mb-4" style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}>
              MBTA PTAR Register
            </h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label style={labelStyling}>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  We just might sell your data.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label style={labelStyling}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  No spam... we promise.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label style={labelStyling}>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="themeToggle"
                  onChange={() => setLight(!light)}
                />
                <label className="form-check-label text-muted" htmlFor="themeToggle">
                  {bgText}
                </label>
              </div>

              {error && (
                <div className="text-danger mb-3" style={{ fontWeight: "500" }}>
                  {error}
                </div>
              )}

              <Button type="submit" style={buttonStyling} className="w-100">
                Register
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
