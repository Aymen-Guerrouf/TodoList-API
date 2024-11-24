const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allows null values
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    emailVerificationToken: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    emailTokenexpiresIn: {
      type: Date,
      default: Date.now() + 24 * 60 * 60 * 1000,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
