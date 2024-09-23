const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authGuard = async (req, res, next) => {
    try {
        const cookie = req.cookies[process.env.COOKIE];
        console.log("COOKIE", cookie);
        if (!cookie) {
            throw new Error("Authentication failed");
        }
        const tokenData = jwt.verify(cookie, process.env.SECRETE);
        console.log("tokenData", tokenData);
        if (tokenData) {
            const userId = tokenData?._id;
            const user = await User.findById(userId);
            if (user) {
                req.user = user;
                next();
            } else {
                throw new Error("Authentication failed");
            }
        } else {
            throw new Error("Authentication failed");
        }
    } catch (error) {
        res.status(500).json({
            error: "Authentication failed",
        });
    }
};
module.exports = authGuard;
