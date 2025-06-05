const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    image: { type: String },
    category: { type: String },
    categoryContent: { type: String },
    Status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // default to inactive player
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("categories", CategorySchema);
