const express = require("express");
const path = require("path");
const cors = require("cors");
const CryptoJS = require("crypto-js")

const app = express();

const rp = (p) => path.join(__dirname, p)

// Server files
const tokenHandler = require("./server/tokenHandler.js")
const accountHandler = require("./server/accountHandler.js")
const groupHandler = require("./server/groupHandler")

app.use(express.static(rp("public")))
app.use(express.json())

app.use(cors({
    origin: '*',
    credentials: true
}))

function authenticateToken(req, res, next) {
    if (!req.headers.cookie) return res.redirect("/register")
    if (!req.headers.cookie.includes("token=")) return res.redirect("/register")
    const token = req.headers.cookie.split("token=")[1];
    if (!token) return res.redirect("/register")
    else {
        tokenHandler.verifyToken(token, (t) => {
            if (!t) return res.redirect("/register")

            res.token = t.token;
            res.user = CryptoJS.AES.decrypt(t.name, process.env.accountEncryptionKey).toString(CryptoJS.enc.Utf8);

            next();
        })
    }

}

function authAlready(req, res, next) {
    if (!req.headers.cookie) return next()
    if (!req.headers.cookie.includes("token=")) return next()
    const token = req.headers.cookie.split("token=")[1];
    if (!token) return next()
    else {
        tokenHandler.verifyToken(token, (t) => {
            if (t) return res.redirect("/")
            next()
        })

    }
}

// Middleware

app.get("/", (req, res) => {
    if (!req.headers.cookie) return res.sendFile(rp("html/index-out.html"))
    if (!req.headers.cookie.includes("token=")) return res.sendFile(rp("html/index-out.html"))
    const token = req.headers.cookie.split("token=")[1];
    if (!token) return res.sendFile(rp("html/index-out.html"))
    else {
        tokenHandler.verifyToken(token, (t) => {
            if (!t) return res.sendFile(rp("html/index-out.html"))

            res.token = t.token;
            res.user = CryptoJS.AES.decrypt(t.name, process.env.accountEncryptionKey).toString(CryptoJS.enc.Utf8);

            res.sendFile(rp("html/index.html"))
        })
    }
})

const fs = require("fs");
app.get("/join/:group", (req, res) => {
    const d = fs.readFileSync(rp("html/join.html"), "utf8").replaceAll("{{ groupName }}", req.params.group)
    res.send(d);
})

app.get("/api/join-group/:group", authenticateToken, (req, res) => {
    groupHandler.joinGroup(res.user, req.params.group, (s) => {
        res.send(s);
    })
})

app.get("/api/leave-group/:group", authenticateToken, (req, res) => {
    groupHandler.leaveGroup(res.user, req.params.group, (s) => {
        res.send(s);
    })
})

app.get("/api/get-user-groups", authenticateToken, (req, res) => {
    groupHandler.getUserGroups(res.user, (g) => {
        res.send({ groups: g });
    })
})

app.get("/groups/:group", (req, res) => {
    const d = fs.readFileSync(rp("html/group.html"), "utf8").replaceAll("{{ group }}", req.params.group)
    res.send(d);
})

// Accounts
app.get("/register", authAlready, (req, res) => {
    res.sendFile(rp("html/accounts/register.html"))
})

app.post("/api/register", authAlready, (req, res) => {
    accountHandler.register(req.body.name, req.body.email, req.body.password, (d) => {
        setTimeout(() => {
            if (d.error) {
                res.send({ sucess: false, error: d.error })
            } else {
                res.cookie("token", d.token);
                res.send({ sucess: true })
            }
        }, Math.random() * (4000 - 2000) + 2000)
    })
})

// 404
app.get("*", (req, res) => {
    res.sendFile(rp("html/404.html"))
})

app.listen(5000, () => {
    console.log("Server running on port 5000\nhttp://localhost:5000")
})