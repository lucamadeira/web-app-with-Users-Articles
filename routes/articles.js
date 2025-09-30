const express = require('express');
const Articlrouter = express.Router();
const db = require('../db/init');
const { ensureAuth } = require('../middleware/auth');

// Form nuovo articolo
Articlrouter.get('/new', ensureAuth, (req, res) => {
    res.render('new_article', { error: null });
});

// Salva nuovo articolo
Articlrouter.post('/new', ensureAuth, (req, res) => {
    const { title, content } = req.body;
    if (!title || !content)
        return res.render('new_article', { error: 'Titolo e contenuto sono obbligatori' });

    db.run(
  'INSERT INTO articles (title, body, user_id) VALUES (?, ?, ?)',
  [title, content, req.session.userId],
  function(err) {
      if (err) return res.send('Errore DB: ' + err.message);
      res.redirect('/'); // torna alla homepage dopo aver creato l’articolo
  }
);

});

Articlrouter.get('/:id', (req, res) => {
    const id = req.params.id;
    db.get(
        'SELECT articles.*, users.username FROM articles JOIN users ON articles.user_id = users.id WHERE articles.id = ?',
        [id],
        (err, article) => {
            if (err) return res.send('Errore DB: ' + err.message);
            if (!article) return res.send('Articolo non trovato');

            db.all(
                'SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE article_id = ?',
                [id],
                (err, comments) => {
                    if (err) return res.send('Errore DB: ' + err.message);
                    res.render('article', { article, comments, userId: req.session.userId});
                }
            );
        }
    );
});


// Form modifica
Articlrouter.get('/:id/edit', ensureAuth, (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM articles WHERE id = ?', [id], (err, article) => {
        if (err) return res.send('Errore DB: ' + err.message);
        if (!article) return res.send('Articolo non trovato');
        if (article.user_id !== req.session.userId) return res.send('Non autorizzato');

        res.render('edit_article', { article, error: null });
    });
});

// Salva modifica
Articlrouter.post('/:id/edit', ensureAuth, (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;

    if (!title || !content) return res.send('Titolo e contenuto obbligatori');

    db.run(
        'UPDATE articles SET title = ?, content = ? WHERE id = ? AND user_id = ?',
        [title, content, id, req.session.userId],
        function(err) {
            if (err) return res.send('Errore DB: ' + err.message);
            res.redirect('/articles/' + id);
        }
    );
});


// Cancella articolo
Articlrouter.get('/:id/delete', ensureAuth, (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM articles WHERE id = ? AND user_id = ?', [id, req.session.userId], function(err) {
        if (err) return res.send('Errore DB: ' + err.message);
        res.redirect('/'); // torna alla home dopo eliminazione
    });
});


Articlrouter.post('/comments/new', ensureAuth, (req, res) => {
    const { article_id, content } = req.body;
    if (!content) return res.send('Commento vuoto');

    db.run(
        'INSERT INTO comments (content, article_id, user_id) VALUES (?, ?, ?)',
        [content, article_id, req.session.userId],
        function(err) {
            if (err) return res.send('Errore DB: ' + err.message);
            res.redirect('/articles/' + article_id);
        }
    );
});


Articlrouter.get('/comments/:id/delete', ensureAuth, (req, res) => {
    const commentId = req.params.id;
    db.get('SELECT * FROM comments WHERE id = ?', [commentId], (err, comment) => {
        if (err) return res.send('Errore DB: ' + err.message);
        if (!comment) return res.send('Commento non trovato');
        if (comment.user_id !== req.session.userId) return res.send('Non autorizzato');

        db.run('DELETE FROM comments WHERE id = ?', [commentId], function(err) {
            if (err) return res.send('Errore DB: ' + err.message);
            res.redirect('/articles/' + comment.article_id);
        });
    });
});


module.exports = Articlrouter;
