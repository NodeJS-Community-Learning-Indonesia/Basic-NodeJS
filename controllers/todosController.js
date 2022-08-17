const Todo = require("../models/Todo");
const User = require("../models/User");
const wrapper = require("../utils/responses");

// @desc     Set todos
// @route    POST /todos
// @access   Private
const todosHandler = async (req, res) => {
    if (!req.body.todo) {
        return wrapper.error(res, null, "Missing Credentials");
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return wrapper.error(res, null, "User not Found");
        }
        const newTodo = new Todo({
            userId: user._id,
            todo: req.body.todo,
        });
        const data = await newTodo.save();
        return wrapper.success(res, data, "Todo has been created");
    } catch (error) {
        return wrapper.error(res, null, "Something Wrong");
    }
};

// @desc     Get todos
// @route    GET /todos
// @access   Private
const getTodos = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return wrapper.error(res, null, "User not Found");
        }
        const todos = await Todo.find({ userId: user._id });
        if (todos.length === 0) {
            return wrapper.success(res, null, "No Todos");
        }
        return wrapper.success(res, todos, "get all todos");
    } catch (error) {
        console.log(error);
        return wrapper.error(res, null, "Something Wrong");
    }
};

// @desc     Update todos
// @route    PUT /todos
// @access   Private
const updateTodos = async (req, res) => {
    if (!req.params.id || !req.body.todo) {
        return wrapper.error(res, null, "Missing credentials");
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return wrapper.error(res, null, "User not found");
        }
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return wrapper.error(res, null, "Todo not found");
        }
        if (!todo.userId.equals(user._id)) {
            return wrapper.error(res, null, "Not Authorized User", 401);
        }
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { todo: req.body.todo },
            { runValidators: true, new: true }
        );
        return wrapper.success(res, updatedTodo, "Todo Updated");
    } catch (error) {
        console.log(error);
        return wrapper.error(res, null, "Something Wrong");
    }
};

// @desc     Delete todos
// @route    DELETE /todos
// @access   Private
const deleteTodo = async (req, res) => {
    if (!req.params.id) {
        return wrapper.error(res, null, "Missing credentials");
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return wrapper.error(res, null, "User not found");
        }
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return wrapper.error(res, null, "Todo not found");
        }
        if (!todo.userId.equals(user._id)) {
            return wrapper.error(res, null, "Not Authorized User", 401);
        }
        const deletedTodo = await Todo.findByIdAndRemove(req.params.id);
        return wrapper.success(res, deletedTodo, "Deleted Todo");
    } catch (error) {
        return wrapper.error(res, null, "Something Wrong");
    }
};

module.exports = {
    todosHandler,
    getTodos,
    updateTodos,
    deleteTodo,
};
