// const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

const URI =
    "mongodb+srv://vidiya:vidiyagummallaweb321@cluster0.2nclyb0.mongodb.net/dev-tinder";
// const client = new MongoClient(URI);
// async function run() {
//     try {
//         await client.connect();
//         console.log("Data base connection established successfully");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

async function run() {
    try {
        await mongoose.connect(URI, {
            connectTimeoutMS: 1000,
        });
        console.log("MongoDB Connected");
        // .then(() => console.log("MongoDB Connected"))
        // .catch((err) => console.log("Connection Error: ", err));
    } catch (error) {
        throw new Error("Unable to connect to DB", error);
    }
}

module.exports = run;
