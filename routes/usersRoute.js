const express = require("express");
const router = express.Router();
const {
    registerHandler,
    loginHandler,
} = require("../controllers/usersController");

// register handle
router.post("/register", registerHandler);

// login handler
router.post("/login", loginHandler);

module.exports = router;
