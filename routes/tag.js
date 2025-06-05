const express = require("express");
const router = express.Router();

const { creatTag,
    getallTags,
    getsingleTags,
    deleteTag,
    updateTags, getTagsByCategory } = require("../controllers/tagController");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");


/* --------- Tag crud section ----------  */

// add
router.post("/create", isAuthenticatedUser, creatTag);

//getAllTags
router.get("/all", isAuthenticatedUser, getallTags);

// get single Tags
router.get("/single", isAuthenticatedUser, getsingleTags);

//Delete
router.delete("/delete", isAuthenticatedUser, deleteTag);

//Update
router.put("/update", isAuthenticatedUser, updateTags);

// Get tags by category ID
router.post("/category", isAuthenticatedUser, getTagsByCategory);

module.exports = router;
