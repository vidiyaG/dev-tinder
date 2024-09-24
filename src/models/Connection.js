const mongoose = require("mongoose");
const ConnectionSchema = mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User",
        },
        toUserId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User",
        },
        status: {
            type: String,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is not a valid status`,
            },
            required: true,
        },
    },
    { timestamps: true }
);

ConnectionSchema.index({
    fromUserId: 1,
    toUserId: 1,
});
ConnectionSchema.pre("save", function (next) {
    const connection = this;
    if (connection.fromUserId.equals(connection.toUserId)) {
        throw new Error("Connection cannot be send to self");
    }
    next();
});

const ConnectionModel = mongoose.model("Connection", ConnectionSchema);
module.exports = ConnectionModel;
