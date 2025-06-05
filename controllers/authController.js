// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET, JWT_ACCESS_TIME } = require("../config");
const { sendResetPasswordEmail } = require("../Configuration/emailService");
const passport = require("passport");
const { oauth2Client } = require("../Configuration/passport");



// Register API (create Users)
module.exports.register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User({ firstName, lastName, email, password });
        await user.save();

        // const token = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_TIME });
        const token = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });


        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            // error: false,
            token,
            user,
        });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: "Failed to register user" });
    }
};

// Login API
module.exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if the password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // const token = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_TIME });
        const token = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });

        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            error: false,
            token,
            user,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to login user" });
    }
};

// logout
module.exports.logout = async (req, res, next) => {
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
        res.status(500).json({ error: "Failed to logout user" });
    }
};

// Google login route
module.exports.googleLogin = async (req, res, next) => {
    const { tokenId } = req.body; // The ID token from the frontend (sent after Google login)
    console.log("tokenId ----------------------- 0 ", tokenId);

    try {
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
        });

        const profile = ticket.getPayload(); // Get the user profile

        // Check if the user already exists in the database
        var user = await User.findOne({ email: profile.email });

        if (!user) {
            // User doesn't exist, create a new user
            user = new User({
                firstName: profile.given_name,
                lastName: profile.family_name,
                email: profile.email,
            });
            await user.save();
        }

        // Create JWT token for the user
        // const token = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, {
        //     expiresIn: JWT_ACCESS_TIME,
        // });
        const token = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });

        return res.status(200).json({
            message: "Google login successful",
            success: true,
            user, // Return user info
            token,  // Return JWT token
        });
    } catch (error) {
        console.log("Google login error:", error);
        res.status(500).json({ error: "Failed to authenticate with Google" });
    }
};

// Define the Google Authentication API
module.exports.googleAuth = async (req, res, next) => {

    const tokenId = req.body.tokenId;
    try {
        // Verify the ID token received from Google
        const googleRes = await oauth2Client.verifyIdToken({
            idToken: tokenId,                     // The ID token from the frontend
            audience: process.env.GOOGLE_CLIENT_ID,  // Ensure the client ID matches
        });

        const payload = googleRes.getPayload();  // Extract user information from the payload
        const { email, given_name } = payload;  // Extract email, name, and picture from the payload

        let user = await User.findOne({ email });

        if (!user) {
            // If the user doesn't exist, create a new user
            user = await User.create({
                firstName: given_name,
                lastName: given_name,
                email: email,
            });
        }

        // const jwtToken = jwt.sign({ userId: user?._id }, JWT_ACCESS_SECRET, {
        //     expiresIn: JWT_ACCESS_TIME,  // Set the JWT expiration time
        // });
        const jwtToken = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });

        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            error: false,
            token: jwtToken,  // Send the token back to the frontend
            user,
        });
    } catch (err) {
        console.error("Google auth error:", err);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

module.exports.googleCallback = async (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/' }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Authentication failed' });

        // Generate a token (JWT) if needed
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_TIME });
                // const token = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });
                const token = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });



        // Send response with user info and token
        res.status(200).json({
            message: 'Google login successful',
            success: true,
            user: user,
            token,
        });
    })(req, res, next); // Pass req, res, and next for middleware chaining
};

// Route to handle forgot password
module.exports.forgotpassword = async (req, res) => {
    const { email } = req.body;
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid Email please try again!" });
    }
    // Generate a reset password token using the createJWT method
    // Get ResetPassword Token
    const resetToken = await user.getResetPasswordToken();
    user.resetToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send the reset password email using the email service
    await sendResetPasswordEmail(user?.email, resetToken);

    // Respond with a success message
    return res.status(200).json({
        success: true,
        message: `Reset password link sent to the email ${user?.email}`,
    });
};

// resetpassword
module.exports.resetpassword = async (req, res) => {
    const { newPassword, confirmPassword, clientToken } = req.body;

    if (!newPassword || !clientToken) {
        return res
            .status(404)
            .json({ message: "New password and token are required" });
    }

    let user;
    try {
        // creating token hash
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(clientToken)
            .digest("hex");
        // Check if the user exists and the token is valid, we proceed to reset the password
        user = await User.findOne({
            // email: payload.email,
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Password does not password" });
        }
        // Update the password directly (pre-save middleware will hash it)
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

    } catch (error) {
        console.error(error);
        return res.status(201).json({ message: "Invalid or expired token" });
    }

    // Generate a new token for the user after the password reset
    // const token = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, {
    //     expiresIn: JWT_ACCESS_TIME,
    // });
                const token = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, { issuer: 'tracking', expiresIn: '30d' });

    // Send the response with the updated user details and new token
    return res.status(200).json({
        user: { userId: user._id, name: user.name },
        token,
        msg: "Password changed successfully",
    });
};
