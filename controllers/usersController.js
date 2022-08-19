const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const wrapper = require("../utils/responses");
const uuidv4 = require("uuid").v4;

// @desc     Register Handler
// @route    POST /users/register
// @access   Public
const registerHandler = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return wrapper.error(res, "Missing Credentials");
    }

    if (req.body.password.length < 3) {
        return wrapper.error(res, "Password at least must be 3 characters");
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return wrapper.error(res, "User already existed");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hassPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                userId: uuidv4(),
                name: req.body.name,
                email: req.body.email,
                password: hassPassword,
            });
            await newUser.save();
            return wrapper.success(
                res,
                {
                    userId: newUser.userId,
                    name: newUser.name,
                    email: newUser.email,
                },
                "Account has been created"
            );
        }
    } catch (error) {
        console.log(error);
        return wrapper.error(res, "Something Wrong");
    }
};

// @desc     Login Handler
// @route    POST /users/login
// @access   Public
const loginHandler = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        const msg = "Missing credentials";
        return wrapper.error(res, msg);
    }
    // try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return wrapper.error(res, "Email is not found");
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
        const data = {
            name: user.name,
            email: user.email,
            token: generateToken(user),
        };
        return wrapper.success(res, data, "success login");
    } else {
        return wrapper.error(res, "Password is wrong");
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
