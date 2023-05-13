const express = require("express");
const path = require("path")

const app = express();

// Server files
const tokenHandler = require("./server/tokenHandler.js")
const accountHandler = require("./server/accountHandler.js")

app.listen(5000, () => {
    console.log("Server running on port 5000\nhttp://localhost:5000")
})