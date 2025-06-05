const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to ensure directory exists
const ensureDirectoryExistence = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // Create directory and any missing parent directories
    }
};

// Define Storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folderPath;

        // Set destination based on file type
        if (file.mimetype.startsWith("image/")) {
            folderPath = "./uploads/images/";
        } else if (file.mimetype === "application/pdf") {
            folderPath = "./uploads/pdfs/";
        } else if (file.mimetype.startsWith("video/")) {
            folderPath = "./uploads/videos/";
        } else {
            return cb(new Error("Unsupported file type"), false);
        }

        // Ensure the folder exists
        ensureDirectoryExistence(folderPath);

        cb(null, folderPath); // Pass the folder path to multer
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-")); // Rename file
    },
});

// File Filter for Allowed Types
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("image/") ||
        file.mimetype === "application/pdf" ||
        file.mimetype.startsWith("video/")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only images, PDFs, or videos are allowed!"), false);
    }
};

// Initialize Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 }, // Limit file size to 10MB
});

module.exports = upload;
