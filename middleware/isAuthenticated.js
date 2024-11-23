module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(401).json({ message: "Unauthorized" }); // Respond with a 401 status code and message
    }
  },
};
