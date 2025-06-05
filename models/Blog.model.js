const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    image: { type: String },
    blog: { type: String },
    blogContent: [
      {
        text: { type: String, required: true },
      },
    ],
    Status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // default to inactive player
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bloges", blogSchema);
