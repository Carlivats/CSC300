import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import getUserInfo from "../../utilities/decodeJwt";

const PRIMARY_COLOR = "#6366f1";
const SECONDARY_COLOR = "#1f1f1f";
const LIGHT_COLOR = "#ffffff";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`;

const Login = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ username: "", password: "" });
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

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  useEffect(() => {
    const obj = getUserInfo(user);
    setUser(obj);

    if (light) {
      setBgColor(LIGHT_COLOR);
      setBgText("Dark Mode");
    } else {
      setBgColor(SECONDARY_COLOR);
      setBgText("Light Mode");
    }
  }, [light]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(url, data);
      const { accessToken } = res;
      // Clear any guest user flags
      localStorage.removeItem("guestUser");
      // Set access token
      localStorage.setItem("accessToken", accessToken);
      
      // Dispatch a custom event to notify components about auth change
      window.dispatchEvent(new Event('authChange'));
      
      navigate("/mbtaLayout");
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  if (user) {
    navigate("/mbtaLayout");
    return;
  }

  return (
    <section className="vh-100 d-flex align-items-center" style={backgroundStyling}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 bg-white p-5 rounded-4 shadow">
            <h2 className="text-center mb-4" style={{ color: PRIMARY_COLOR, fontWeight: "bold" }}>
              MBTA PTAR Login
            </h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label style={labelStyling}>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  onChange={handleChange}
                  placeholder="Enter username"
                />
                <Form.Text className="text-muted">We just might sell your data.</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label style={labelStyling}>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="mb-3 text-muted">
                Don't have an account?
                <Link to="/signup" style={{ color: PRIMARY_COLOR, fontWeight: "600", marginLeft: "5px" }}>
                  Sign up
                </Link>
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault"
                  onChange={() => setLight(!light)}
                />
                <label className="form-check-label text-muted" htmlFor="flexSwitchCheckDefault">
                  {bgText}
                </label>
              </div>

              {error && (
                <div className="text-danger mb-3" style={{ fontWeight: "500" }}>
                  {error}
                </div>
              )}

              <Button type="submit" style={buttonStyling} className="w-100">
                Log In
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
