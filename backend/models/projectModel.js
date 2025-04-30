const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const projectModel = mongoose.model("Project", projectSchema);

module.exports = projectModel;
