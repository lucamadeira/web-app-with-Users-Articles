const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFile);

const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');

db.exec(initSql, (err) => {
    if (err) console.error(err.message);
    else console.log('Database inizializzato con successo!');
});

module.exports = db;