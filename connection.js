const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cal_db'
});

conn.connect(function (err) {
    if (err) {
        console.log(err.code);
    } else {
        console.log("Connected to db....")
    }
});

module.exports = conn