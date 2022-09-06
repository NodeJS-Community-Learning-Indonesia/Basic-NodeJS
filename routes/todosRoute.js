const express = require("express");
const router = express.Router();
const {
    todosHandler,
    getTodos,
    updateTodos,
    deleteTodo,
    getTodo,
    updateReminder,
} = require("../controllers/todosController");
const { isAuthenticate } = require("../middleware/auth");

// todos handler
router.post("/", isAuthenticate, todosHandler);

// todos show all
router.get("/", isAuthenticate, getTodos);

// get a todo
router.get("/:id", isAuthenticate, getTodo);

// update todos
router.put("/:id", isAuthenticate, updateTodos);

// update a reminder
router.put("/reminder/:id", isAuthenticate, updateReminder);

// delete todo
router.delete("/:id", isAuthenticate, deleteTodo);

module.exports = router;
