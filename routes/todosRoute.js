const express = require("express");
const router = express.Router();
const {
    todosHandler,
    getTodos,
    updateTodos,
    deleteTodo,
} = require("../controllers/todosController");
const { isAuthenticate } = require("../middleware/auth");

// todos handler
router.post("/", isAuthenticate, todosHandler);

// todos show all
router.get("/", isAuthenticate, getTodos);

// update todos
router.put("/:id", isAuthenticate, updateTodos);

// delete todo
router.delete("/:id", isAuthenticate, deleteTodo);

module.exports = router;
