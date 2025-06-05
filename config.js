require("dotenv").config();

const configSchema = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_ACCESS_TIME: process.env.JWT_ACCESS_TIME,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    PUBLISHER_KEY: process.env.PUBLISHER_KEY,
    FRONTEND_URL: process.env.FRONTEND_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    SECRET_KEY: process.env.SECRET_KEY,
};
module.exports = configSchema;
