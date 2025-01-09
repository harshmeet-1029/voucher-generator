function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next(); // User is authenticated, proceed to the next middleware/route handler
  }
  res.redirect("/login"); // User is not authenticated, redirect to login
}

module.exports = isAuthenticated;
