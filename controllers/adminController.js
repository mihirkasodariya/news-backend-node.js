// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Admin = require("../models/Admin.model");
const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET, JWT_ACCESS_TIME } = require("../config");
const { verify } = require('jsonwebtoken'); // This is okay, but then you must call verify(), not jwt.verify()


// Register API (create Admins)
module.exports.adminregister = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        admin = new Admin({ firstName, lastName, email, password });
        await admin.save();

        // const token = jwt.sign({ adminId: admin._id }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_TIME });
        const token = jwt.sign({ adminId: admin._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });

        return res.status(201).json({
            message: "Admin registered successfully",
            success: true,
            // error: false,
            token,
            admin,
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: "Failed to register admin" });
    }
};

// Login API
module.exports.adminlogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        // Check if the password matches
        const isMatch = await admin.matchPassword(password);
        console.log('isMatch', isMatch)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // const token = jwt.sign({ adminId: admin._id }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_TIME });
        const token = jwt.sign({ adminId: admin._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });

        return res.status(200).json({
            message: "Admin logged in successfully",
            success: true,
            error: false,
            token,
            admin,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to login admin" });
    }
};

// logout
module.exports.adminlogout = async (req, res, next) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: "Logged Out",
        });
        next();
    } catch (error) {
        res.status(500).json({ error: "Failed to logout admin" });
    }
};

// Google login route
module.exports.admingoogleLogin = async (req, res, next) => {
    const { tokenId } = req.body; // The ID token from the frontend (sent after Google login)

    try {
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
        });

        const profile = ticket.getPayload(); // Get the admin profile

        // Check if the admin already exists in the database
        var admin = await Admin.findOne({ email: profile.email });

        if (!admin) {
            // Admin doesn't exist, create a new admin
            admin = new Admin({
                firstName: profile.given_name,
                lastName: profile.family_name,
                email: profile.email,
            });
            await admin.save();
        }

        // Create JWT token for the admin
        // const token = jwt.sign({ adminId: admin._id }, JWT_ACCESS_SECRET, {
        //     expiresIn: JWT_ACCESS_TIME,
        // });
        const token = jwt.sign({ adminId: admin._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });

        return res.status(200).json({
            message: "Google login successful",
            success: true,
            admin, // Return admin info
            token,  // Return JWT token
        });
    } catch (error) {
        console.log("Google login error:", error);
        res.status(500).json({ error: "Failed to authenticate with Google" });
    }
};

// Define the Google Authentication API
module.exports.admingoogleAuth = async (req, res, next) => {
    const tokenId = req.body.tokenId;
    try {
        // Verify the ID token received from Google
        const googleRes = await oauth2Client.verifyIdToken({
            idToken: tokenId,                     // The ID token from the frontend
            audience: process.env.GOOGLE_CLIENT_ID,  // Ensure the client ID matches
        });

        const payload = googleRes.getPayload();  // Extract admin information from the payload
        const { email, given_name, family_name } = payload;  // Extract email, name, and picture from the payload
        let admin = await Admin.findOne({ email });

        if (!admin) {
            // If the admin doesn't exist, create a new admin
            admin = await Admin.create({
                firstName: given_name,
                lastName: family_name,
                email: email,
            });
        }

        // const jwtToken = jwt.sign({ adminId: admin._id }, JWT_ACCESS_SECRET, {
        //     expiresIn: JWT_ACCESS_TIME,  // Set the JWT expiration time
        // });
        const jwtToken = jwt.sign({ adminId: admin._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });

        res.status(200).json({
            message: "Admin logged in successfully",
            success: true,
            error: false,
            token: jwtToken,  // Send the token back to the frontend
            admin,
        });
    } catch (err) {
        console.error("Google auth error:", err);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

module.exports.admingoogleCallback = async (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/' }, (err, admin, info) => {
        if (err) return next(err);
        if (!admin) return res.status(401).json({ message: 'Authentication failed' });

        // Generate a token (JWT) if needed
        // const token = jwt.sign({ adminId: admin._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
        const token = jwt.sign({ adminId: admin._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });

        // Send response with admin info and token
        res.status(200).json({
            message: 'Google login successful',
            success: true,
            admin: admin,
            token,
        });
    })(req, res, next); // Pass req, res, and next for middleware chaining
};

// Route to handle forgot password
module.exports.adminforgotpassword = async (req, res) => {
    const { email } = req.body;
    // Find admin by email
    let admin = await Admin.findOne({ email });
    if (!admin) {
        return res.status(400).json({ message: "Invalid Email please try again!" });
    }
    // Generate a reset password token using the createJWT method
    // Get ResetPassword Token
    const resetToken = await admin.resetPasswordToken();
    admin.resetToken = resetToken;
    admin.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await admin.save();

    // Send the reset password email using the email service
    await sendResetPasswordEmail(admin?.email, resetToken);

    // Respond with a success message
    return res.status(200).json({
        success: true,
        message: `Reset password link sent to the email ${admin?.email}`,
    });
};

// resetpassword
module.exports.adminresetpassword = async (req, res) => {
    const { newPassword, confirmPassword, clientToken } = req.body;

    if (!newPassword || !clientToken) {
        return res
            .status(404)
            .json({ message: "New password and token are required" });
    }

    let admin;
    try {
        // creating token hash
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(clientToken)
            .digest("hex");
        // Check if the admin exists and the token is valid, we proceed to reset the password
        admin = await Admin.findOne({
            // email: payload.email,
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Password does not password" });
        }
        // Update the password directly (pre-save middleware will hash it)
        admin.password = newPassword;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpire = undefined;
        await admin.save();

    } catch (error) {
        console.error(error);
        return res.status(201).json({ message: "Invalid or expired token" });
    }

    // Generate a new token for the admin after the password reset
    // const token = jwt.sign({ adminId: admin._id }, JWT_ACCESS_SECRET, {
    //     expiresIn: JWT_ACCESS_TIME,
    // });
                const token = jwt.sign({ adminId: admin._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });

    // Send the response with the updated admin details and new token
    return res.status(200).json({
        admin: { adminId: admin._id, name: admin.name },
        token,
        msg: "Password changed successfully",
    });
};
