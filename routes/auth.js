const express = require("express");
const {
  register,
  verifyEmail,
  login,
  logout,
  resetPassword,
  forgetPassword,
  googleAuth,
  googleAuthCallback,
} = require("../controllers/auth");
const { isAuthenticated } = require("../middleware/isAuthenticated");

const router = express.Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);
router.post("/forget-password", forgetPassword);
router.post("/reset/:token", resetPassword);
router.get("/logout", isAuthenticated, logout);

module.exports = router;
