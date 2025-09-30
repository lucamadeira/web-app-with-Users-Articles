# 📝 Mio Blog con Express, SQLite ed EJS

Un semplice progetto di **blog full-stack** realizzato con **Node.js (Express)**, **SQLite** ed **EJS** come motore di template.  
Permette la registrazione/login utenti, la creazione di articoli e la gestione tramite sessione.

---

## 🚀 Funzionalità

- Registrazione con validazione dei campi
- Login/Logout con sessioni
- Password salvate in forma sicura (bcrypt)
- Creazione, modifica e visualizzazione articoli
- Layout con **EJS** + un unico foglio di stile globale
- Middleware per proteggere le rotte private (`ensureAuth`)

---

## 🛠️ Tecnologie utilizzate

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [EJS](https://ejs.co/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [express-session](https://www.npmjs.com/package/express-session)

---

## 📂 Struttura del progetto

mio-blog-express/
│
├─ app.js
├─ db/
│   └─ init.js
├─ middleware/
│   └─ auth.js
├─ routes/
│   ├─ auth.js
│   ├─ articles.js
│   └─ index.js
├─ views/
│   ├─ index.ejs
│   ├─ register.ejs
│   ├─ login.ejs
│   ├─ account.ejs
│   ├─ new_article.ejs
│   ├─ edit_article.ejs
│   └─ article.ejs
└─ package.json