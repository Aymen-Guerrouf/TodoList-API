const ErrorResponse = require("../utils/errorResponse");
const Todo = require("../models/Todo");
const asyncHandler = require("../middleware/async");
const path = require("path");
exports.getAllTodos = asyncHandler(async (req, res, next) => {
  const filter = {};
  console.log("user:", req.user.id);
  if (req.query.title) {
    filter.title = { $regex: req.query.title, $options: "i" };
  }

  if (req.user.id) {
    filter.user = req.user.id;
  }

  if (req.query.completed) {
    filter.completed = req.query.completed === "true";
  }

  let query = Todo.find(filter);
  if (req.query.select) {
    const selectFields = req.query.select.split(",").join("");
    query = query.select(selectFields);
  }

  // Sort results
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Total documents before pagination
  const total = await Todo.countDocuments(filter);

  // Execute query with pagination
  const results = await query.skip(startIndex).limit(limit);

  // Pagination result
  const pagination = {};

  if (startIndex + limit < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: results.length,
    pagination,
    data: results,
    total,
  });
});

// @desc    create a todo
// @route   POST /api/v1/todo
// @access  Private
exports.createTodo = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const todo = await Todo.create(req.body);
  res.status(201).json({
    success: true,
    data: todo,
  });
});
// @desc    Update a todo
// @route   PUT /api/v1/todo/:id
// @access  Private

exports.updateTodo = asyncHandler(async (req, res, next) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!todo) {
    return next(
      new ErrorResponse(`Todo not found with the id of ${req.params.id}`, 404)
    );
  } else {
    res.status(200).json({ success: true, data: todo });
  }
});

// @desc    Delete a todo
// @route   DELETE /api/v1/todo/:id
// @access  Private

exports.deleteTodo = asyncHandler(async (req, res, next) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) {
    return next(
      new ErrorResponse(`Todo not found with the id of ${req.params.id}`, 404)
    );
  }
  res.redirect("/");
  res.status(200).json({ success: true, data: {} });
});
