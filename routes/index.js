const express = require('express');
const router = express.Router();
const db = require('../db/init'); // db SQLite

router.get('/', (req, res) => {
    db.all('SELECT * FROM articles', [], (err, articles) => {
        if (err) return res.send('Errore DB: ' + err.message);

        res.render('index', {
            user: req.session.username || null,
            articles: articles
        });
    });
});

module.exports = router;
