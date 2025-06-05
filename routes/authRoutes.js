const express = require("express");
const { register, login, googleCallback, googleAuth, forgotpassword, resetpassword } = require("../controllers/authController");
const { adminregister, adminlogin, admingoogleCallback, admingoogleAuth, adminforgotpassword, adminresetpassword } = require("../controllers/adminController.js");
// const { isAuthenticatedUser } = require("../middleware/authMiddleware");

const router = express.Router();

// User register and login
router.post("/register", register);
router.post("/login", login);

// Google Callback Route
router.post("/google", googleAuth);
// app.get(
//     "/auth/google",
//     passport.authenticate("google", { scope: ["profile", "email"] })
//   );
router.get("/google/callback", googleCallback);

router.post("/forgotpassword", forgotpassword);
router.post("/resetpassword", resetpassword);



// User register and login
router.post("/admin/register", adminregister);
router.post("/admin/login", adminlogin);

// Google Callback Route
router.post("/admin/google", admingoogleAuth);
router.post("/admin/google/callback", admingoogleCallback);

router.post("/admin/forgotpassword", adminforgotpassword);
router.post("/admin/resetpassword", adminresetpassword);

module.exports = router;
