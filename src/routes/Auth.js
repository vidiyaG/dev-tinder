const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
    validateSignupInput,
    validateLoginInput,
} = require("../utils/validators");

router.post("/signup", async (req, res) => {
    const { firstName, lastName, password, email } = req.body;
    try {
        validateSignupInput({ firstName, lastName, password, email });
        const hashedPwd = await bcrypt.hash(password, +process.env.SALT_ROUNDS);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPwd,
        });
        await user.save();
        res.json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error?._message,
            error: error?.message,
        });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        validateLoginInput({ email, password });
        // const hashedPwd = await bcrypt.hash(password, +process.env.SALT_ROUNDS);
        const user = await User.findOne({ email: email });
        if (user) {
            const result = await bcrypt.compare(password, user?.password);
            if (result) {
                const token = jwt.sign({ _id: user?._id }, process.env.SECRETE);
                res.cookie(process.env.COOKIE, token, {
                    expiresIn: "1h",
                });
                res.json({
                    message: "Login successfull",
                });
            } else {
                res.status(500).json({
                    message: "Invalid credentials",
                });
            }
        } else {
            res.status(500).json({
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error?._message,
            error: error?.message,
        });
    }
});

router.post("/logout", async (req, res) => {
    try {
        if (req.user) {
            res.clearCookie(process.env.COOKIE);
            res.json({ message: "Logged out" });
        } else {
            throw new Error("Unauthorized to logout");
        }
    } catch (error) {
        res.status(500).json({
            message: error?._message,
            error: error?.message,
        });
    }
});

module.exports = router;
