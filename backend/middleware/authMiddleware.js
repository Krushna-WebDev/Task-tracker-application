const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
