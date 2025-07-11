const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please provide a firstName"],
            trim: true,
            maxLength: [20, "firstName cannot be more than 20 characters"],
            minlength: [2, "firstName cannot be less than 2 characters"],
        },
        lastName: {
            type: String,
            required: [true, "Please provide a lastName"],
            trim: true,
            maxLength: [20, "lastName cannot be more than 20 characters"],
            minlength: [2, "lastName cannot be less than 2 characters"],
        },
        email: {
            type: String,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide a valid email",
            ],
            unique: true,
        },
        mobileNumber: {
            type: String,
            // unique: true, // Ensure uniqueness
            match: [/^\d{10}$/, "Please provide a valid 10-digit mobile number"], // Example regex for 10 digits
        },
        password: {
            type: String,
            // required: [true, "Please provide a password"],
            // minlength: [6, "Password cannot be less than 6 characters"],
        },
        resetPasswordToken: { type: String },
        resetPasswordExpire: { type: Date },
        EnquiryType: {
            type: String,
            // required: true,
            // enum: ["active", "inactive"],
            // default: "inactive", // default to inactive User
        },
        WebsiteLink: { type: String },
        Message: { type: String },
        followedCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }], // Example: ["Technology", "Business"]
        followedtags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }] // Example: ["Technology", "Business"]
    },
    { timestamps: true }
);
// Hash password before saving User
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
//  Generating Password Reset Token
UserSchema.methods.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash the token and save it to the user document
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes expiration

    await this.save({ validateBeforeSave: false });

    return resetToken; // Return the plain token
};
module.exports = mongoose.model("User", UserSchema);
