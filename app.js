const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const settingsRoutes = require("./routes/settings");
const isAuthenticated = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Ensure this is a string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true using HTTPS
  })
);
app.set("view engine", "ejs");
app.use(express.static("public"));

// Connect to the database
connectDB();

// Routes
app.use("/", authRoutes);
app.use("/dashboard", isAuthenticated, dashboardRoutes);
app.use("/settings", isAuthenticated, settingsRoutes);
app.use("*", (req, res) => {
  res.status(404).render("404");
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
