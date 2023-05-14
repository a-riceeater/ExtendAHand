const sqlite3 = require("sqlite3").verbose();
const path = require("path")
const postHandler = require("./postHandler.js")

const groupDb = new sqlite3.Database(path.join(__dirname, '../database/groupDb.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
groupDb.run(`CREATE TABLE IF NOT EXISTS userGroups(user TEXT NOT NULL, groups TEXT NOT NULL)`)

module.exports = {
    joinGroup: function (user, group, cb) {
        groupDb.get("SELECT * FROM userGroups WHERE user = ?", [user], (err, row) => {
            if (err) throw err;

            const groups = eval(row.groups);

            if (groups.length == 0) { return g() }
            else {
                for (let i = 0; i < groups.length; i++) {
                    if (groups[i] == group) {
                        return cb({ error: "You are already in this group!", joined: false })
                    }

                    if (i == groups.length - 1) return g();
                }
            }

            var gExec = false;
            function g() {
                if (gExec) return;

                gExec = true;
                groups.push(group);

                groupDb.run("UPDATE userGroups SET user = ?, groups = ? WHERE user = ?", [user, JSON.stringify(groups), user], (err) => {
                    if (err) throw err;
                    cb({ error: false, joined: true })
                })
            }
        })
    },
    leaveGroup: function (user, group, cb) {
        groupDb.get("SELECT * FROM userGroups WHERE user = ?", [user], (err, row) => {
            if (err) throw err;

            const groups = eval(row.groups);

            if (groups.length == 0) return cb({ error: "You are not in any groups!", left: false })
            else {
                for (let i = 0; i < groups.length; i++) {
                    if (groups[i] == group) return g(i);

                    if (i == groups.length - 1) return cb({ error: "You are not part of this group!", left: false })
                }
            }

            function g(index) {
                delete groups[index];

                groupDb.run("UPDATE userGroups SET user = ?, groups = ? WHERE user = ?", [user, JSON.stringify(groups), user], (err) => {
                    if (err) throw err;
                    return cb({ error: false, left: true })
                })
            }
        })
    },
    getUserGroups: function (user, cb) {
        groupDb.get("SELECT * FROM userGroups WHERE user = ?", [user], (err, row) => {
            if (err) throw err;

            return cb(eval(row.groups));
        })
    },
    userInGroup(user, group, cb) {
        groupDb.get("SELECT * FROM userGroups WHERE user = ?", [user], (err, row) => {
            if (err) throw err;

            const groups = eval(row.groups);
            return cb(groups.includes(group));
        })
    },
    handle: function(g, c) {

    }
}