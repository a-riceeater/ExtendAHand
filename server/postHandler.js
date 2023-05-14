const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const postDb = new sqlite3.Database(path.join(__dirname, '../database/postDb.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

require("dotenv").config()

module.exports = {
    createTable: function (name, c) {
        groupDb.run(`CREATE TABLE IF NOT EXISTS ${name}{(user TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, id TEXT NOT NULL, comments TEXT NOT NULL)`)
        c(true);
    }
}