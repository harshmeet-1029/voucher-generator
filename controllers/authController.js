exports.login = (req, res) => {
  const { username, password } = req.body;
  // Hardcoded for demonstration; replace with database check
  if (username === "admin" && password === "admin") {
    req.session.user = { username }; // Store user info in session
    return res.redirect("/dashboard"); // Redirect to dashboard after login
  }
  res.render("login", { error: "Invalid credentials" }); // Render login page with error message
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    // Destroy the session
    if (err) {
      return res.status(500).send("Failed to logout");
    }
    res.redirect("/login"); // Redirect to login page
  });
};
