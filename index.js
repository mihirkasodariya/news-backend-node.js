const express = require("express");
const connectDB = require("./database/db");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
// var morgan = require("morgan");
// const passport = require("passport");
// const session = require("express-session");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
// Set up express-session middleware
// app.use(session({
//     secret: 'yourSecretKey',  // change this to something secure
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false }  // use true if serving over HTTPS
// }));

app.use(cors());
// app.use(morgan("tiny"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
// Initialize passport
// app.use(passport.initialize());
// app.use(passport.session());
// Get absolute path to "uploads" directory
const uploadsPath = path.join(__dirname, "uploads");

// Serve static files from "uploads" folder
app.use("/uploads", express.static(uploadsPath));
// route connection
app.use("/", require("./routes"));

// Set up HTTP server with Express
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});
