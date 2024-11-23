const express = require("express");
const router = express.Router();
const passport = require("passport");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const { sendConfirmationEmail, sendResetEmail } = require("../utils/sendEmail");

exports.register = asyncHandler(async (req, res, next) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return next(
      new ErrorResponse("Please provide an email, name and password", 400)
    );
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(
      new ErrorResponse(`User already exists with email ${email}`, 400)
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
  });

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = verificationToken;
  await user.save();

  // Send verification email
  await sendConfirmationEmail(user.email, verificationToken);

  res.status(201).json({
    success: true,
    message:
      "Registration successful. Please check your email to verify your account.",
  });
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  // Find user with matching token that hasn't expired
  const user = await User.findOne({
    emailVerificationToken: token,
    emailTokenexpiresIn: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired verification token",
    });
  }

  // Update user as verified
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailTokenExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Email verified successfully. You can now log in.",
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new ErrorResponse(info.message, 401));
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user,
      });
    });
  })(req, res, next);
});

// Google OAuth

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
});

exports.googleAuthCallback = [
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    res.status(201).json({ success: true });
  },
];

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("User not found with this email", 404));
  }

  // generate a reset token
  const token = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  await sendResetEmail(user.email, token);
  res.status(200).json({
    success: true,
    message: "Email sent to reset password",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse("Invalid or expired token", 400));
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  await sendConfirmationEmail(user.email);

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

//logout

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error during logout",
      });
    }
    res.json({
      success: true,
      message: "Logout successful",
    });
  });
};
