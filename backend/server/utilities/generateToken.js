const jwt = require("jsonwebtoken");

function generateAccessToken(id, email, username) {
  return jwt.sign(
    { id, email, username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = { generateAccessToken };
