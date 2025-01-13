const express = require("express");
const router = express.Router();

// Render login page
router.get("/login", (req, res) => {
  res.render("login", { message: null, type: null });
});

// Redirect to login if accessing the root
router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login"); // Redirect to login
  }
});

// Handle login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Hardcoded for demonstration;
  if (username === "admin" && password === "admin") {
    req.session.user = { username }; // Store user info in session
    return res.redirect("/dashboard"); // Redirect to dashboard after login
  }
  res.render("login", { message: "Invalid credentials", type: "error" }); // Render login page with error message
});

// Handle logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    // Destroy the session
    if (err) {
      return res.status(500).send("Failed to logout");
    }
    res.redirect("/login"); // Redirect to login page
  });
});

module.exports = router;
