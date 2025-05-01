const express = require("express") 
const mongoose = require("mongoose")
const cors = require("cors");
const userRoutes = require("./routes/userRoutes")
const projectRoutes = require("./routes/projectRoutes")
const taskRoutes = require("./routes/taskRoutes")
const app = express()
const dotenv = require("dotenv"); 
const jwt = require("jsonwebtoken");

dotenv.config();

app.use(cors());


app.use(express.json());

// Add basic health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Task Tracker API is running",
    env: {
      jwt_secret_exists: !!process.env.JWT_SECRET,
      mongodb_uri_exists: !!process.env.MONGODB_URI
    }
  });
});

// Add a test endpoint to diagnose user creation
app.get("/test-user", async (req, res) => {
  try {
    // Get User model
    const User = require('./models/userModel');
    
    // Test MongoDB connection
    const db = mongoose.connection;
    const isConnected = db.readyState === 1; // 1 = connected
    
    // Test database operations
    const count = await User.countDocuments();
    
    // Return diagnostic info
    res.json({
      success: true,
      db_connected: isConnected,
      user_count: count,
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      mongodb_uri_starts_with: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 10) + '...' : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Add right after your existing endpoints
app.get("/test-no-auth", (req, res) => {
  res.status(200).json({ 
    message: "This endpoint works without auth",
    jwt_secret_length: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0
  });
});

// Add after your test-no-auth endpoint
app.post("/verify-token", (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ 
      valid: false, 
      message: "No token provided" 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ 
      valid: true, 
      user: decoded,
      jwt_secret_first_chars: process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 3) + '...' : null
    });
  } catch (error) {
    res.status(400).json({ 
      valid: false, 
      message: error.message 
    });
  }
});

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Server error', 
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});