const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc     Register Handler
// @route    POST /users/register
// @access   Public
const registerHandler = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        res.status(400).json({ msg: "Missing Credentials" });
    }

    if (req.body.password.length < 3) {
        res.status(400).json({ msg: "Password at least must be 3 characters" });
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(400).json({ msg: "User already existed" });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hassPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hassPassword,
            });
            await newUser.save();
            res.status(200).json({
                msg: "Account has been created",
                email: req.body.email,
            });
        }
    } catch (error) {
        res.status(400).json({ msg: "Something Wrong" });
        console.log(error);
    }
};

// @desc     Login Handler
// @route    POST /users/login
// @access   Public
const loginHandler = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({ msg: "Missing Credentials" });
    }
    // try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(400).json({ msg: "Email is not found" });
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
        res.status(200).json({
            email: user.email,
            token: generateToken(user),
        });
    } else {
        res.status(400).json({ msg: "Password is wrong" });
    }
    // } catch (error) {
    //     console.log(error)
    // }
};

// generate token
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1d",
    });
};

module.exports = {
    registerHandler,
    loginHandler,
};
