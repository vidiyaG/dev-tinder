const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Connection = require("../models/Connection");

const authGuard = require("./AuthGuard");
const { validateConnectionData } = require("../utils/validators");

router.post("/:status/:toUserId", authGuard, async (req, res) => {
    const { status, toUserId } = req.params;
    const user = req.user;
    try {
        validateConnectionData({ status, toUserId });
        const toUserExists = await User.findById(toUserId);
        if (!toUserExists) {
            throw new Error("User not exists");
        }
        const existedConection = await Connection.findOne({
            $or: [
                {
                    fromUserId: user?._id,
                    toUserId: toUserId,
                },
                {
                    fromUserId: toUserId,
                    toUserId: user?._id,
                },
            ],
        });
        console.log(existedConection);
        if (existedConection) {
            throw new Error("Connection already existed");
        } else {
            const connection = new Connection({
                fromUserId: user?._id,
                toUserId,
                status,
            });
            await connection.save();
            res.json({ message: "Connection request sent successfully" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});

router.get("/:status", authGuard, async (req, res) => {
    const user = req.user;
    const { status } = req.params;

    try {
        const connections = await Connection.find({
            fromUserId: user?._id,
        });
        res.json({ connections });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});
module.exports = router;
