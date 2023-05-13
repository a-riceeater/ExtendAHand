const express = require("express");
const path = require("path")

const app = express();

const rp = (p) => path.join(__dirname, p) 

// Server files
const tokenHandler = require("./server/tokenHandler.js")
const accountHandler = require("./server/accountHandler.js")

// Middleware

app.get("/", (req, res) => {
    res.sendFile(rp("html/index.html"))
})

const fs = require("fs");
app.get("/join/:group", (req, res) => {
    const d = fs.readFileSync(rp("html/join.html"), "utf8").toString().replaceAll("{{ groupName }}", req.params.group)
    res.send(d);
})

// 404
app.get("*", (req, res) => {
    res.sendFile(rp("html/404.html"))
})

app.listen(5000, () => {
    console.log("Server running on port 5000\nhttp://localhost:5000")
})