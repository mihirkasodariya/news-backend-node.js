const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    // heading: {
    //   type: String,
    //   required: [true, "Please provide a heading"],
    //   trim: true,
    //   maxLength: [100, "Heading cannot be more than 100 characters"],
    //   minlength: [2, "Heading cannot be less than 2 characters"],
    // },
    heroimage: { type: String },
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxLength: [100, "Title cannot be more than 100 characters"],
      minlength: [2, "Title cannot be less than 2 characters"],
    },
    summary: [
      {
        text: { type: String, required: true },
      },
    ],
    content_1: [
      {
        text: { type: String, required: true },
      },
    ],
    image_2: { type: String },
    content_2: [
      {
        text: { type: String, required: true },
      },
    ],
    image_3: { type: String },
    content_3: [
      {
        text: { type: String, required: true },
      },
    ],
    Status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    tagId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
    newsDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);