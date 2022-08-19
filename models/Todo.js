const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
    },
    todo: {
        type: String,
        required: true,
    },
    reminder: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Todo", TodoSchema);
