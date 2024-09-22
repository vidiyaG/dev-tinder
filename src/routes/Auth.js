const express = require("express");
const router = express.Router();
const User = require("../models/User");
router.post("/signup", async (req, res) => {
    console.log(req.url);
    const data = req.body;

    try {
        const user = new User(data);
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

module.exports = router;
