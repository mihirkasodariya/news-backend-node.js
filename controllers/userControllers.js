const { sendNotificationEmail, sendSubscriptionEmails } = require("../Configuration/emailService");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const CategoryModel = require("../models/Category.model");
const Subscription = require("../models/Subscription");
const TagModel = require("../models/Tag.model");

const User = require("../models/User.model");


module.exports.getPlayer = async (req, res, next) => {
    const user = req.user;
    const playerId = user.userId;
    const userData = await User.findById(playerId);

    if (!userData) {
        return next(new ErrorHander("userData not found", 404));
    } else {
        res.status(200).json({
            success: true,
            userData,
        });
    }
};

module.exports.updateProfile = async (req, res, next) => {
    try {
        const user = req.user;
        const playerId = user.userId;
        await User.findByIdAndUpdate(
            playerId,
            {
                ...req.body
            },
            { new: false, runValidators: true }
        );
        return res.status(200).json({
            success: true,
            msg: "Profile updated successfully",
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.alluser = async (req, res, next) => {
    const userData = await User.find();

    if (!userData) {
        return next(new ErrorHander("userData not found", 404));
    } else {
        res.status(200).json({
            success: true,
            userData,
        });
    }
};

module.exports.ConnectMessage = async (req, res, next) => {
    const { firstName, lastName, email, enquiryType, websiteLink, message } = req.body;

    if (!firstName || !lastName || !email || !enquiryType || !websiteLink || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            // If user exists, update the existing record
            user.firstName = firstName;
            user.lastName = lastName;
            user.EnquiryType = enquiryType;
            user.WebsiteLink = websiteLink;
            user.Message = message;
            await user.save();
        } else {
            return res.status(404).json({ message: "User not found" });

            // // If user does not exist, create a new one
            // user = new User({ firstName, lastName, email, enquiryType, websiteLink, message });
            // await user.save();
        }

        // Send a notification email
        await sendNotificationEmail(firstName, email, websiteLink, message);

        res.status(200).json({ message: "Message processed successfully!" });
    } catch (error) {
        console.error("Error processing the message:", error);
        res.status(500).json({ error: "Failed to process the message. Please try again." });
    }
};


module.exports.followCategory = async (req, res, next) => {
    const userData = req.user;
    const userId = userData.userId;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found !" });
        }
        const category = await CategoryModel.findById(req?.body?.categoryId);

        // Prevent duplicate follows
        if (!user.followedCategories.includes(category?._id)) {
            user.followedCategories.push(category?._id);
        }

        await user.save();
        return res.json({ message: "Followed successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports.unfollowCategory = async (req, res, next) => {
    const userData = req.user;
    const userId = userData.userId;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found !" });
        }

        const category = await CategoryModel.findById(req?.body?.categoryId);
        // Remove from followed lists
        user.followedCategories = user.followedCategories.filter(id => id.toString() !== category?._id.toString());

        await user.save();
        return res.json({ message: "Unfollowed successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports.followTag = async (req, res, next) => {
    const userData = req.user;
    const userId = userData.userId;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found !" });
        }
        const tag = await TagModel.findById(req.body.tagId);

        // Prevent duplicate follows
        if (!user.followedtags.includes(tag?._id)) {
            user.followedtags.push(tag._id);
        }

        await user.save();
        return res.json({ message: "Followed successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message }); l

    }
};

module.exports.unfollowTag = async (req, res, next) => {
    const userData = req.user;
    const userId = userData.userId;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found !" });
        }

        const tag = await TagModel.findById(req.body.tagId);
        // Remove from followed lists
        user.followedtags = user.followedtags.filter(id => id.toString() !== tag._id.toString());

        await user.save();
        return res.json({ message: "Unfollowed successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports.subscribe = async (req, res, next) => {
    const { email } = req.body;

    // Basic email validation
    if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Invalid email address" });
    }

    try {
        let user = await Subscription.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already Subscribed !" });
        }
        // Simulating email storage (replace with database logic)
        console.log(`New subscription: ${email}`);
        // Save subscription data to the database
        const subscription = new Subscription({ email });
        await subscription.save();
        // Send a confirmation email (optional)
        await sendSubscriptionEmails("firstName", email);

        return res.status(200).json({ success: true, message: "Subscribed successfully" });
    } catch (error) {
        console.log("error", error);

        return res.status(500).json({ message: "Server error", error });
    }
};