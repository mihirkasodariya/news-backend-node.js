const express = require("express");
const router = express.Router();

const { creatNews,
    getallNews,
    getsingleNews,
    deleteNews,
    updateNews, HomeCategorys, CategoryWisenews, CategoryWiseNewsById, CategoryAndTagWiseNews, CategoryTagAndNewsWiseNews, Latestnews } = require("../controllers/newsControllers");
const upload = require("../middleware/multer");
const { isAuthenticatedUser } = require("../middleware/authMiddleware");


/* --------- New crud section ----------  */

// add
router.post("/create", isAuthenticatedUser, upload.fields([
    { name: "heroimage", maxCount: 1 }, // Handle heroimage upload
    { name: "image_2", maxCount: 1 },   // Handle image_2 upload
    { name: "image_3", maxCount: 1 },   // Handle image_3 upload
]), creatNews);

//getAllNews
router.get("/all", isAuthenticatedUser, getallNews);

// get single News
router.get("/single", isAuthenticatedUser, getsingleNews);

//Delete
router.delete("/delete", isAuthenticatedUser, deleteNews);

//Update
router.put(
    "/update", isAuthenticatedUser,
    upload.fields([
        { name: "heroimage", maxCount: 1 }, // Handle heroimage upload
        { name: "image_2", maxCount: 1 }, // Handle image_2 upload
        { name: "image_3", maxCount: 1 }, // Handle image_3 upload
    ]),
    updateNews
);


//Update
router.get("/HomeCategorys", isAuthenticatedUser, HomeCategorys);

router.get("/CategoryWisenews", isAuthenticatedUser, CategoryWisenews);

// Define the route with categoryId as a parameter
router.post("/CategoryWiseNewsById", isAuthenticatedUser, CategoryWiseNewsById);

// Define the route with categoryId and tagId as query parameters
router.post("/categoryAndTagWiseNews", isAuthenticatedUser, CategoryAndTagWiseNews);

// Define the route with categoryId, tagId, and newsId as query parameters
router.post("/categoryTagNewsWiseNews", isAuthenticatedUser, CategoryTagAndNewsWiseNews);
router.get("/Latestnews", isAuthenticatedUser, Latestnews);



module.exports = router;
