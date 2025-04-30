const express = require("express") 
const mongoose = require("mongoose")
const cors = require("cors");
const userRoutes = require("./routes/userRoutes")
const projectRoutes = require("./routes/projectRoutes")
const taskRoutes = require("./routes/taskRoutes")
const app = express()
const dotenv = require("dotenv"); 

dotenv.config();

app.use(cors());


app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});