const Todo = require("../models/Todo");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc     Set todos
// @route    POST /todos
// @access   Private
const todosHandler = (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            return res.status(403).json({ msg: "Not Authorized" });
        } else {
            if (!req.body.todo) {
                return res.status(400).json({ msg: "Missing Credentials" });
            }
            try {
                const user = await User.findById(data.id);
                if (!user) {
                    return res.status(400).json({ msg: "User not Found" });
                }
                const newTodo = new Todo({
                    userId: user._id,
                    todo: req.body.todo,
                });
                await newTodo.save();
                res.status(200).json({
                    msg: "Todo has been created",
                    todo: req.body.todo,
                });
            } catch (error) {
                res.status(400).json({ msg: "Something Wrong" });
                console.log(error);
            }
        }
    });
};

// @desc     Get todos
// @route    GET /todos
// @access   Private
const getTodos = (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            return res.status(403).json({ msg: "Not Authorized" });
        } else {
            try {
                const user = await User.findById(data.id);
                if (!user) {
                    return res.status(400).json({ msg: "User not Found" });
                }
                const todos = await Todo.find({ userId: user._id });
                if (todos.length === 0) {
                    return res.status(200).json({ msg: "No Todos" });
                }
                res.status(200).json(todos);
            } catch (error) {
                res.status(400).json({ msg: "Something Wrong" });
                console.log(error);
            }
        }
    });
};

// @desc     Update todos
// @route    PUT /todos
// @access   Private
const updateTodos = (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            return res.status(403).json({ msg: "Not Authorized" });
        } else {
            if (!req.params.id || !req.body.todo) {
                return res.status(400).json({ msg: "Missing credentials" });
            }
            try {
                const user = await User.findById(data.id);
                if (!user) {
                    return res.status(400).json({ msg: "User not found" });
                }
                const todo = await Todo.findById(req.params.id);
                if (!todo) {
                    return res.status(400).json({ msg: "Todo not found" });
                }
                if (!todo.userId.equals(user._id)) {
                    return res.status(400).json({ msg: "Not Authorized User" });
                }
                const updatedTodo = await Todo.findByIdAndUpdate(
                    req.params.id,
                    { todo: req.body.todo },
                    { runValidators: true, new: true }
                );
                res.status(200).json(updatedTodo);
            } catch (error) {
                res.status(400).json({ msg: "Something Wrong" });
                console.log(error);
            }
        }
    });
};

// @desc     Delete todos
// @route    DELETE /todos
// @access   Private
const deleteTodo = (req, res) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            return res.status(403).json({ msg: "Not Authorized" });
        } else {
            if (!req.params.id) {
                return res.status(400).json({ msg: "Missing credentials" });
            }
            try {
                const user = await User.findById(data.id);
                if (!user) {
                    return res.status(400).json({ msg: "User not found" });
                }
                const todo = await Todo.findById(req.params.id);
                if (!todo) {
                    return res.status(400).json({ msg: "Todo not found" });
                }
                if (!todo.userId.equals(user._id)) {
                    return res.status(400).json({ msg: "Not Authorized User" });
                }
                const deletedTodo = await Todo.findByIdAndRemove(req.params.id);
                res.status(200).json(deletedTodo);
            } catch (error) {
                res.status(400).json({ msg: "Something Wrong" });
                console.log(error);
            }
        }
    });
};

module.exports = {
    todosHandler,
    getTodos,
    updateTodos,
    deleteTodo,
};
