const sqlite3 = require("sqlite3").verbose();
const path = require("path")

const groupDb = new sqlite3.Database(path.join(__dirname, '../database/tokenDb.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
groupDb.run(`CREATE TABLE IF NOT EXISTS userGroups(token TEXT NOT NULL, email TEXT NOT NULL)`)

module.exports = {
    joinGroup: function(user, group, cb) {

    },
    leaveGroup: function (user, group, cb) {

    }
}