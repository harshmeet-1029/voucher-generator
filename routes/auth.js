const express = require("express");
const router = express.Router();

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
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Hardcoded for demonstration; replace with database check
  if (username === "a" && password === "a") {
    req.session.user = { username }; // Store user info in session
    return res.redirect("/dashboard"); // Redirect to dashboard after login
  }
  res.render("login", { error: "Invalid credentials" }); // Render login page with error message
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
