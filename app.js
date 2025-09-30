// File: app.js
const express = require('express');
const Router = require('./routes/auth'); 
const session = require('express-session');
const bodyParser = require('body-parser');
// const expressLayouts = require('express-ejs-layouts');
const db = require('./db/init'); // Inizializzo il database
const SQLiteStore = require('connect-sqlite3')(session);
const indexRouter = require('./routes/index');
const Articlrouter = require('./routes/articles');
const path = require('path'); 



const app = express();

// Configuro EJS e i layout
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
// app.use(expressLayouts);

// Cartella per file statici (CSS, immagini)
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

// Middleware per parsing form
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware Configuro sessioni
app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: './db' }),
  secret: 'mia-chiave-segreta',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


// Importo e registro le route (creeremo questi file dopo)
app.use( Router);
app.use('/', indexRouter);
app.use('/articles',Articlrouter ); // <--- importante


// Avvio server
app.listen(3000, () => {
  console.log('Server avviato su http://localhost:3000');
});
