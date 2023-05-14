const sqlite3 = require("sqlite3");
const path = require("path");
const postDb = new sqlite3.Database(path.join(__dirname, '../database/postDb.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
const tokenHandler = require("./tokenHandler");

require("dotenv").config()

module.exports = {
    createTable: async function (name, c) {
        await postDb.run(`CREATE TABLE IF NOT EXISTS ${name}(user TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, id TEXT NOT NULL, comments TEXT NOT NULL)`)
        c(true);
    },
    createPost: function (pd, user, group, c) {
        try {
            this.createTable(group, () => {
                let id = tokenHandler.createRandomId();
                let insertdata = postDb.prepare(`INSERT INTO ${group} VALUES(?, ?, ?, ?, ?)`);
                insertdata.run(user, pd.title, pd.body, id, JSON.stringify([]));
                insertdata.finalize();
                c({ status: true, id: id });
            })
        } catch (err) {
            c({ status: false });
        }
    },
    getPosts: function (table, c) {
        postDb.all(`SELECT * FROM ${table}`, (err, rows) => {
            if (err) return c([{
                "user": "An error occured.", "title": "An error occured.", "body": "An error occured.", "id": "An error occured.", "comments": "An error occured."
            }]);

            c(rows);
        })
    },
    getPost: function (table, id, c) {
        postDb.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
            if (err) return c({
                "user": "An error occured.", "title": "An error occured.", "body": "An error occured.", "id": "An error occured.", "comments": "An error occured."
            });
            c(row);
        })
    },
    addComment: function (id, user, cmt, group, c) {
        postDb.get(`SELECT * FROM ${group} WHERE id = ?`, [id], (err, row) => {
            if (err) return c(false);
            
            const comments = eval(row.comments);
            comments.push(JSON.stringify({
                user: user,
                comment: cmt
            }));

            postDb.run(`UPDATE ${group} SET comments = ? WHERE id = ?`, [JSON.stringify(comments), id], (err) => {
                if (err) return c(false);
                c(true);
            })
        })
    },
    getComments: function (id, group, c) {
        postDb.get(`SELECT * FROM ${group} WHERE id = ?`, [id], (err, row) => {
            if (err) return c(false)
            c(row.comments);
        })
    }
}