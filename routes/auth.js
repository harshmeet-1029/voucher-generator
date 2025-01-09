const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/authController");
const isAuthenticated = require("../middleware/auth"); // Import the middleware

// Render login page
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Redirect to login if accessing the root
router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// Handle login
router.post("/login", login);

// Handle logout
router.get("/logout", logout);

// Protect the dashboard route
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard"); // Render the dashboard if authenticated
});

module.exports = router;
