const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12345678901234567890"
const sqlite3 = require("sqlite3").verbose();
const path = require("path")
const fs = require("fs")

if (!fs.existsSync("../database")) fs.mkdirSync("../database") 

const tokenDb = new sqlite3.Database(path.join(__dirname, '../database/tokenDb.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
tokenDb.run(`CREATE TABLE IF NOT EXISTS tokens(token TEXT NOT NULL, name TEXT NOT NULL)`)

function createToken(name) {
    let token = '';
    for (let i = 0; i < 7; i++) {
        let l = alphabet.charAt(Math.random() * (alphabet.length - 0) + 0);
        if (i == 0 && l == '-' || l == 0 && isNum(l)) l = 'a'

        token += l
    }

    token += "-"

    for (let i = 0; i < 7; i++) {
        let l = alphabet.charAt(Math.random() * (alphabet.length - 0) + 0);
        if (i == 0 && l == '-' || l == 0 && isNum(l)) l = 'a'

        token += l
    }

    token += "-"

    for (let i = 0; i < 7; i++) {
        let l = alphabet.charAt(Math.random() * (alphabet.length - 0) + 0);
        if (i == 0 && l == '-' || l == 0 && isNum(l)) l = 'a'

        token += l
    }

    token += "-"

    let insertdata = tokenDb.prepare(`INSERT INTO tokens VALUES(?,?)`);
    insertdata.run(token.toString(), name.toString())
    insertdata.finalize();
    return token;
}

function verifyToken(token, cb) {
    tokenDb.get(`SELECT * FROM tokens WHERE token = ?`, [token], (err, row) => {
        if (err) throw err;

        if (!row) cb(false)
        else cb(row)
    })
}

function deleteToken(token, callback) {
    tokenDb.run("DELETE FROM tokens WHERE token = ?", [token], (err) => {
        if (err) throw err;
        console.log(`removed token (${token}) database`)
        callback()
    })
}

function createRandomId() {
    let token = '';
    for (let i = 0; i < 7; i++) {
        let l = alphabet.charAt(Math.random() * (alphabet.length - 0) + 0);
        if (i == 0 && l == '-' || l == 0 && isNum(l)) l = 'a'

        token += l
    }

    token += "-"

    for (let i = 0; i < 7; i++) {
        let l = alphabet.charAt(Math.random() * (alphabet.length - 0) + 0);
        if (i == 0 && l == '-' || l == 0 && isNum(l)) l = 'a'

        token += l
    }

    token += "-"

    for (let i = 0; i < 7; i++) {
        let l = alphabet.charAt(Math.random() * (alphabet.length - 0) + 0);
        if (i == 0 && l == '-' || l == 0 && isNum(l)) l = 'a'

        token += l
    }

    return token;
}

module.exports = {
    createToken,
    verifyToken,
    deleteToken,
    createRandomId
}

function isNum(a) {
    return !isNaN(parseInt(a))
}