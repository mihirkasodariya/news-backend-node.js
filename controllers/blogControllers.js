const BlogModel = require("../models/Blog.model");
const ErrorHander = require("../utils/errorhandaler");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create Blog Controller
module.exports.creatBlog = async (req, res, next) => {
  const { blog, blogContent, Status } = req.body;

  const imagePath = req.files.image ? req.files.image[0].path : null;
  const blogData = {
    image: imagePath,
    blog,
    blogContent,
    Status,
  };

  // Get file paths

  const newBlog = await BlogModel.create(blogData);

  if (!newBlog) {
    return next(new ErrorHander("Blog cannot be created...", 404));
  }

  return res.status(200).json({
    success: true,
    Blog: newBlog,
  });
};

//get all Blogs
module.exports.getallBlogs = async (req, res) => {
  try {
    const Blogs = await BlogModel.find().sort({ updatedAt: -1 }); // Sorting by updatedAt in descending order;
    res.status(200).json({
      success: true,
      Blogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Blogs" });
  }
};

//getsingleBlogs
module.exports.getsingleBlogs = async (req, res, next) => {
  let id = req.query.id;
  let Blog = await BlogModel.findById(id);

  if (!Blog) {
    return next(new ErrorHander("Cannot found Blogs..", 404));
  }
  res.status(200).json({
    success: true,
    Blog,
  });
};

//Delete Blog
module.exports.deleteBlog = async (req, res, next) => {
  let id = req.query.id;
  try {
    const deleteBlog = await BlogModel.findByIdAndDelete(id);
    if (!deleteBlog) {
      return next(new ErrorHander("Blogs not found", 404));
    }
    return res.status(200).json({ message: "Blogs deleted successfully" });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

module.exports.updateBlogs = async (req, res, next) => {
  try {
    const id = req.query.id;
    const { blog, blogContent, Status } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    let Blog = await BlogModel.findById(id);

    if (!Blog) {
      return next(new ErrorHander("Blog not found", 404));
    }

    // Check if an image is uploaded
    const imagePath = req.files?.image ? req.files.image[0].path : Blog.image;

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      {
        blog,
        blogContent,
        Status,
        image: imagePath, // Preserve existing image if no new image is uploaded
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Failed to update Blog" });
    }

    return res.status(200).json({
      success: true,
      msg: "Blog updated successfully",
      updatedBlog,
    });
  } catch (error) {
    console.error("Update Blog Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
