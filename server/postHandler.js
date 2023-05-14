const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const postDb = new sqlite3.Database(path.join(__dirname, '../database/postDb.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
const tokenHandler = require("./tokenHandler");

require("dotenv").config()

module.exports = {
    createTable: function (name, c) {
        postDb.run(`CREATE TABLE IF NOT EXISTS ${name}(user TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, id TEXT NOT NULL, comments TEXT NOT NULL)`)
        c(true);
    },
    createPost: function (pd, user, group, c) {
        try {
            let insertdata = postDb.prepare(`INSERT INTO ${group} VALUES(?, ?, ?, ?, ?)`);
            insertdata.run(user, pd.title, pd.body, tokenHandler.createRandomId(), JSON.stringify([]));
            insertdata.finalize();
            c(true);
        } catch (err) {
            c(false);
        }
    },
    getPosts: function (table, c) {
        postDb.all(`SELECT * FROM ${table}`, (err, rows) => {
            if (err) c("An error occured.");
            
            c(rows);
        })
    },
    getPost: function (id, c) {
        postDb.get(`SELECT * FROM posts WHERE id = ?`, [id], (err, row) => {
            if (err) c("An error occured.");
            c(row);
        })
    }
}