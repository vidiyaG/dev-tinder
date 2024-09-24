const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Connection = require("../models/Connection");

const authGuard = require("./AuthGuard");
const {
    validateConnectionReqData,
    validateConnectionReviewData,
    CONNECTION_STATUS,
    POPULATE_USER_FIELDS,
} = require("../utils/validators");
const { off } = require("../models/User");

router.get("/requested/:status", authGuard, async (req, res) => {
    const user = req.user;
    const { status } = req.params;

    try {
        const connections = await Connection.find({
            fromUserId: user?._id,
        }).populate("toUserId", POPULATE_USER_FIELDS);
        res.json({ connections });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});
router.post("/:status/:toUserId", authGuard, async (req, res) => {
    const { status, toUserId } = req.params;
    const user = req.user;
    try {
        validateConnectionReqData({ status, toUserId });
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
        if (existedConection) {
            throw new Error(`Connection already ${existedConection.status}`);
        } else {
            const connection = new Connection({
                fromUserId: user?._id,
                toUserId,
                status,
            });
            await connection.save();
            res.json({ message: `Connection ${status} successfully` });
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});

router.get("/awaiting", authGuard, async (req, res) => {
    const user = req.user;
    const { status } = req.params;

    try {
        const requests = await Connection.find({
            toUserId: user?._id,
            status: CONNECTION_STATUS.interested,
        }).populate("fromUserId", POPULATE_USER_FIELDS);
        res.json({ requests });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});
router.post("/review/:status/:requestId", authGuard, async (req, res) => {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    // 1. CHECK is loggedinUser is same to toUserId of connection whose requestId;
    // 2. Connection status should be in interested then only accept or reject
    // 3. RequestId should be valid in records;
    try {
        validateConnectionReviewData({ status, requestId });
        const connectionRecord = await Connection.findOne({
            _id: requestId,
            toUserId: loggedInUser?._id,
            status: CONNECTION_STATUS.interested,
        });

        if (connectionRecord) {
            const statusTobeChanged =
                status == "accept"
                    ? CONNECTION_STATUS.accepted
                    : status == "reject"
                    ? CONNECTION_STATUS.rejected
                    : null;
            if (statusTobeChanged) {
                connectionRecord.status = statusTobeChanged;
                const updatedConnection = await connectionRecord.save();
                res.json({
                    message: `Connection ${statusTobeChanged}`,
                    data: updatedConnection,
                });
            }
        } else {
            throw new Error("Connection Request not found");
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});

router.get("/feed", authGuard, async (req, res) => {
    const user = req.user;
    let { limit, page } = req.query;
    const maxAllowedLimit = 50;
    limit = limit ? (limit > maxAllowedLimit ? maxAllowedLimit : limit) : 10;
    offset = ((page || 1) - 1) * limit;

    try {
        // loggedin user should not see the cards of the
        // 1. himself
        // 2. already send connection request - status not in (interested,rejected,accepted );
        // 3. users ignored/rejected by him
        const connections = await Connection.find({
            $or: [{ fromUserId: user._id }, { toUserId: user._id }],
        }).select(["fromUserId", "toUserId"]);
        // .populate("fromUserId", ["firstName"])
        // .populate("toUserId", ["firstName"]);
        const connectionSet = new Set();

        connections.forEach((con) => {
            connectionSet.add(con.fromUserId.toString());
            connectionSet.add(con.toUserId.toString());
        });
        const connetedUsers = Array.from(connectionSet);
        const feedUsers = await User.find({
            _id: { $nin: connetedUsers },
        })
            .select(POPULATE_USER_FIELDS)
            .limit(limit)
            .skip(offset);

        res.json({
            feedUsers,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error?.message,
        });
    }
});

module.exports = router;
