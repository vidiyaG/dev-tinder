const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authGuard = require("./AuthGuard");
const { validateUpdateProfileData } = require("../utils/validators");

router.get("/", authGuard, async (req, res) => {
    try {
        const users = await User.find({});
        res.json({ users: users });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});
router.get("/profile", authGuard, async (req, res) => {
    try {
        res.json(req?.user);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});

router.post("/profile/edit", authGuard, async (req, res) => {
    try {
        const user = req.user;
        const data = req.body;
        validateUpdateProfileData(data);
        Object.keys(data).every((key) => (user[key] = data[key]));
        await user.save();
        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});
router.get("/", authGuard, async (req, res) => {
    const { userId } = req.query;
    if (!userId) res.status(500).json({ message: "Invalid userId" });

    try {
        const user = await User.findById(userId);
        res.json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});

router.delete("/", authGuard, async (req, res) => {
    const { userId } = req.query;
    if (!userId) res.status(500).json({ message: "Invalid userId" });

    try {
        const user = await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});

router.patch("/", authGuard, async (req, res) => {
    const data = req.body;

    try {
        const user = await User.findByIdAndUpdate(data?.userId, data, {
            returnDocument: "after",
            runValidators: true,
        });
        res.json({ message: "User updated", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});

module.exports = router;
