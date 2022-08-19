const Todo = require("../models/Todo");
const User = require("../models/User");
const wrapper = require("../utils/responses");
const moment = require("moment");

// @desc     Set todos
// @route    POST /todos
// @access   Private
const todosHandler = async (req, res) => {
    if (
        !req.body.todo ||
        !req.body.createdAt ||
        typeof req.body.reminder === "undefined"
    ) {
        return wrapper.error(res, "Missing Credentials");
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return wrapper.error(res, "User not Found");
        }
        const newTodo = new Todo({
            userId: req.user.id,
            todo: req.body.todo,
            reminder: req.body.reminder,
            createdAt: req.body.createdAt,
        });
        const data = await newTodo.save();
        const date = moment(req.body.createdAt).format("dddd, MMMM Do YYYY");
        return wrapper.success(
            res,
            {
                id: data._id,
                todo: data.todo,
                reminder: data.reminder,
                updatedAt: date,
            },
            "Todo has been created"
        );
    } catch (error) {
        console.log(error);
        return wrapper.error(res, "Something Wrong");
    }
};

// @desc     Get todos
// @route    GET /todos
// @access   Private
const getTodos = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return wrapper.error(res, "User not Found");
        }
        const todos = await Todo.find({ userId: user._id });

        if (todos.length === 0) {
            return wrapper.success(res, null, "No Todos");
        }
        const getAllTodos = todos.map((x) => {
            return {
                id: x._id,
                text: x.todo,
                day: moment(x.updatedAt).format("dddd, MMMM Do YYYY"),
                reminder: x.reminder,
            };
        });
        return wrapper.success(res, getAllTodos, "get all todos");
    } catch (error) {
        console.log(error);
        return wrapper.error(res, "Something Wrong");
    }
};

// @desc     Get a todo
// @route    GET /todos/:id
// @access   Private
const getTodo = async (req, res) => {
    if (!req.params.id) {
        return wrapper.error(res, "Missing credentials");
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return wrapper.error(res, "User not Found");
        }
        const todos = await Todo.find({ userId: user._id });
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return wrapper.success(res, "No Todos");
        }
        return wrapper.success(res, todo, "get a todo");
    } catch (error) {
        console.log(error);
        return wrapper.error(res, "Something Wrong");
    }
};

// @desc     Update todos
// @route    PUT /todos
// @access   Private
const updateTodos = async (req, res) => {
    if (
        !req.params.id ||
        !req.body.todo ||
        typeof req.body.reminder === "undefined" ||
        !req.body.updatedAt
    ) {
        return wrapper.error(res, "Missing credentials");
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return wrapper.error(res, "User not found");
        }
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return wrapper.error(res, "Todo not found");
        }
        if (!todo.userId.equals(user._id)) {
            return wrapper.error(res, "Not Authorized User", 401);
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                todo: req.body.todo,
                reminder: req.body.reminder,
                updatedAt: req.body.updatedAt,
            },
            { runValidators: true, new: true }
        );
        return wrapper.success(res, updatedTodo, "Todo Updated");
    } catch (error) {
        console.log(error);
        return wrapper.error(res, "Something Wrong");
    }
};

// @desc     Delete todos
// @route    DELETE /todos
// @access   Private
const deleteTodo = async (req, res) => {
    if (!req.params.id) {
        return wrapper.error(res, "Missing credentials");
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return wrapper.error(res, "User not found");
        }
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return wrapper.error(res, "Todo not found");
        }
        if (!todo.userId.equals(user._id)) {
            return wrapper.error(res, "Not Authorized User", 401);
        }
        const deletedTodo = await Todo.findByIdAndRemove(req.params.id);
        return wrapper.success(res, deletedTodo, "Deleted Todo");
    } catch (error) {
        return wrapper.error(res, error);
    }
};

const updateReminder = async (req, res) => {
    if (!req.params.id || typeof req.body.reminder === "undefined") {
        return wrapper.error(res, "Missing Credential");
    }
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return wrapper.error(res, "Todo not found");
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                reminder: req.body.reminder,
            },
            { runValidators: true, new: true }
        );
        return wrapper.success(res, updatedTodo, "Todo Updated");
    } catch (error) {
        console.log(error);
        return wrapper.error(res, "Something Wrong");
    }
};

module.exports = {
    todosHandler,
    getTodos,
    updateTodos,
    deleteTodo,
    getTodo,
    updateReminder,
};
