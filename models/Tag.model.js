const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
  {
    tag: { type: String },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    Status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // default to inactive player
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tag", TagSchema);
