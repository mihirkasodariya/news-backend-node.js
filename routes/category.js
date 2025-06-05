const express = require("express");
const router = express.Router();

const { creatCategory,
    getallCategorys,
    getsingleCategorys,
    deleteCategory,
    updateCategorys, } = require("../controllers/categoryControllers.js");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer.js");

/* --------- Category crud section ----------  */

// add
// Routes
router.post(
    "/create",
    upload.fields([
        { name: "image", maxCount: 1 }, // Single image upload
    ]), isAuthenticatedUser, creatCategory)

//getAllCategorys
router.get("/all", getallCategorys);

// get single Categorys
router.get("/single", isAuthenticatedUser, getsingleCategorys);

//Delete
router.delete("/delete", isAuthenticatedUser, deleteCategory);

//Update
//Update
router.put(
    "/update",
    upload.fields([
        { name: "image", maxCount: 1 }, // Single image upload
    ]), isAuthenticatedUser,
    updateCategorys
);

module.exports = router;
