const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const userSchema = Schema(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 50,
        },
        lastName: { type: String },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate(val) {
                if (!validator.isEmail(val)) {
                    throw new Error("Invalid email");
                }
            },
        },
        age: { type: Number, required: true, min: 18 },
        gender: {
            type: String,
            required: true,
            lowercase: true,
            validate(val) {
                if (!["male", "female", "other"].includes(val)) {
                    throw new Error("Invalid gender");
                }
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 15,
            validate(val) {
                if (!validator.isStrongPassword(val)) {
                    throw new Error("Week password");
                }
            },
        },
        imageUrl: {
            type: String,
            default:
                "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Free-File-Download.png",
            validate(val) {
                if (!validator.isURL(val)) {
                    throw new Error("Invalid imageUrl");
                }
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
