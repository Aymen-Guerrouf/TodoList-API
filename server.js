const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const error = require("./middleware/error");
const session = require("express-session");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const configurePassport = require("./config/passport");
const User = require("./models/User");

//Route files
const todos = require("./routes/todo");
const auth = require("./routes/auth");

// Load environment variables from .env file
dotenv.config({ path: "./config/config.env" });

const app = express();

// Connect to database
connectDB();

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Configure passport
configurePassport(app);

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});
app.use(limiter);

// Body parser
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//mount routers
app.use("/api/v1/todos", todos);
app.use("/api/v1/auth", auth);

app.use(error);
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.green.bold);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
