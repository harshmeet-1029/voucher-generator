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
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.render("login", { error: null });
  }
});

// Handle login
router.post("/login", login);

// Handle logout
router.get("/logout", logout);

module.exports = router;
