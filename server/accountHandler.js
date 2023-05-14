const tokenManager = require("./tokenHandler");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const accountDb = new sqlite3.Database(path.join(__dirname, '../database/accountDb.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
const groupDb = new sqlite3.Database(path.join(__dirname, '../database/groupDb.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

const CryptoJS = require('crypto-js');
accountDb.run(`CREATE TABLE IF NOT EXISTS accounts(name TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL)`)
require("dotenv").config()

module.exports = {
    register: function (name, email, password, cb) {
        if (!email || !password || !name) return
        if (!email.replaceAll(" ", "") || !password.replaceAll(" ", "") || !name.replaceAll(" ", "")) return;

        email = email.trim()
        name = name.trim()
        password = password.trim()


        accountDb.all("SELECT * from accounts", (err, rows) => {
            if (err) throw err;


            if (rows.length == 0) {
                let gd = groupDb.prepare("INSERT INTO userGroups VALUES(?,?)")
                gd.run(name, JSON.stringify([]));
                gd.finalize();

                let insertdata = accountDb.prepare(`INSERT INTO accounts VALUES(?,?,?)`);
                name = CryptoJS.AES.encrypt(name, process.env.accountEncryptionKey).toString();
                email = CryptoJS.AES.encrypt(email, process.env.accountEncryptionKey).toString();
                password = CryptoJS.AES.encrypt(password, process.env.accountEncryptionKey).toString();

                insertdata.run(name, email, password)
                insertdata.finalize();

                const token = tokenManager.createToken(name);
                console.log("token: " + token)
                cb({ name: name, token: token })
                return
            }

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (CryptoJS.AES.decrypt(row.name, process.env.accountEncryptionKey).toString(CryptoJS.enc.Utf8) == name) {
                    cb({ error: "Name already exists! " })
                    console.log("name is already in use! (" + email + ")");
                    return;
                }

                if (i == rows.length - 1) {
                    let gd = groupDb.prepare("INSERT INTO userGroups VALUES(?,?)")
                    gd.run(name, JSON.stringify([]));
                    gd.finalize();

                    let insertdata = accountDb.prepare(`INSERT INTO accounts VALUES(?,?,?)`);
                    name = CryptoJS.AES.encrypt(name, process.env.accountEncryptionKey).toString();
                    email = CryptoJS.AES.encrypt(email, process.env.accountEncryptionKey).toString();
                    password = CryptoJS.AES.encrypt(password, process.env.accountEncryptionKey).toString();

                    insertdata.run(name, email, password)
                    insertdata.finalize();

                    const token = tokenManager.createToken(name);
                    console.log("token: " + token)
                    cb({ name: name, token: token })
                }
            }
        })

    },
    login: function (email, password, cb) {

        accountDb.all("SELECT * FROM accounts", (err, rows) => {
            if (err) throw err;


            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];

                let e = CryptoJS.AES.decrypt(row.email, process.env.accountEncryptionKey).toString(CryptoJS.enc.Utf8)
                let p = CryptoJS.AES.decrypt(row.password, process.env.accountEncryptionKey).toString(CryptoJS.enc.Utf8)

                if (e == email && p == password) {
                    const token = tokenManager.createToken(CryptoJS.AES.encrypt(email, process.env.accountEncryptionKey));
                    return cb(token)
                }

                if (i == rows.length - 1) {
                    return cb(false)
                }
            }
        })
    }
}