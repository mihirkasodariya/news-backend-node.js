const express = require("express");
const router = express.Router();

const {
  creatBlog,
  getallBlogs,
  getsingleBlogs,
  deleteBlog,
  updateBlogs,
} = require("../controllers/blogControllers.js");
const upload = require("../middleware/multer.js");
 const { isAuthenticatedUser } = require("../middleware/authMiddleware");

/* --------- Blog crud section ----------  */

// add
// Routes
router.post(
  "/create",
  upload.fields([
    { name: "image", maxCount: 1 }, // Single image upload
  ]), isAuthenticatedUser, 
  creatBlog
);

//getAllBlogs
router.get("/all", getallBlogs);

// get single Blogs
router.get("/single", isAuthenticatedUser, getsingleBlogs);

//Delete
router.delete("/delete", isAuthenticatedUser, deleteBlog);

//Update
router.put(
  "/update",
  upload.fields([
    { name: "image", maxCount: 1 }, // Single image upload
  ]),
  isAuthenticatedUser, updateBlogs
);

module.exports = router;
