const express = require("express");
require("dotenv").config();
const db = require("./src/config/database");
const app = express();
const PORT = process.env.PORT || 3000;
const authRouter = require("./src/routes/Auth");
const userRouter = require("./src/routes/User");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/users", userRouter);

db()
    .then(() => {
        app.listen(PORT, (err, res) => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(console.dir);
