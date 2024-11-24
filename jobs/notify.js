const cron = require("node-cron");
const Todo = require("../models/Todo");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const { sendEmail } = require("../utils/sendEmail");

const checkTodos = asyncHandler(async () => {
  // Get all today todos
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

  console.log(startOfDay, endOfDay); // for testing purpose, remove in prod

  const todos = await Todo.find({
    dueDate: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
    isNotified: false,
  }).populate("user", "email");
  if (todos.length === 0) {
    console.log("No tasks due today.");
    return;
  }

  for (const task of todos) {
    await sendEmail(task.user.email);
    console.log(`Notification sent for task: ${task.title}`);
    // update the toddo
    task.isNotified = true;
    await task.save();
  }
});
// just check
cron.schedule("* * * * *", checkTodos);

module.exports = { checkTodos };
