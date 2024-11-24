const mongoose = require("mongoose");

const todoschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [20, "Name cannot be more than 20 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      maxlength: [100, "Description cannot be more than 100 characters"],
    },
    isNotified: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      required: [true, "Please provide a due date"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Todo", todoschema);
