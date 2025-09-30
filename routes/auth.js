const express = require('express');
const router = express.Router();
const db = require('../db/init');
const bcrypt = require('bcrypt');
const { ensureAuth } = require('../middleware/auth');

// Pagina di registrazione
router.get('/register', (req, res) => {
    res.render('register', { error: req.query.error || null });
});

// Gestione registrazione
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const password_hash = bcrypt.hashSync(password, 10);

     db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).send('Errore server: ' + err.message);
    if (row) return res.redirect('/register?error=Email già registrata');

    db.run(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, password_hash],
        function(err) {
            if (err) return res.send('Errore registrazione: ' + err.message);
            res.redirect('/login'); 
        }
    );
});

});


// Pagina di login
router.get('/login', (req, res) => {
    res.render('login', { error: req.query.error || null });
});

// Gestione login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.send('Errore DB: ' + err.message);
        if (!user) return res.redirect('/login?error=Utente non trovato');

        const passwordMatch = bcrypt.compareSync(password, user.password_hash);
        if (!passwordMatch) return res.redirect('/login?error=Password errata');

        req.session.userId = user.id;
        req.session.username = user.username;

        res.redirect('/'); 
    });
});



router.get('/account', ensureAuth, (req, res) => {
    res.send(`Benvenuto ${req.session.username}, questa è la tua pagina account`);
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Errore logout');
        res.redirect('/login');
    });
});

router.get('/account', ensureAuth, (req, res) => {
    db.all('SELECT * FROM articles WHERE user_id = ?', [req.session.userId], (err, articles) => {
        if (err) return res.send('Errore DB: ' + err.message);

        res.render('account', {
            username: req.session.username,
            articles: articles
        });
    });
});



module.exports = router;
