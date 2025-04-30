const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;
