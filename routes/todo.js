const express = require("express");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const {
  getAllTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todo");

const router = express.Router();

router.get("/", isAuthenticated, getAllTodos);
router.post("/", isAuthenticated, createTodo);
router.put("/:id", isAuthenticated, updateTodo);
router.delete("/:id", isAuthenticated, deleteTodo);
module.exports = router;
