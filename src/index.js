
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/view');

app.use(express.urlencoded({
    extended: true,
}));

app.use(express.json());

const session = require('express-session');
// const session = require('cookie-session');
app.use(session({
    secret: 'chave secreta de criptografia',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))


app.use(express.static('public'));

app.use('*', (req, res, next) => {
    next();
})

app.get('/', (req, res) => {
    res.redirect('/grupos');
});

const gruposRoutes = require('./routes/grupos-routes');
app.use('/grupos', gruposRoutes);

const usersRoutes = require('./routes/users-routes');
app.use('/users', usersRoutes);

app.use('*', (req, res) => {
    return res.status(404).send(`
        <h1>Sorry, not found!!!</h1>
        <a href="/grupos">VOLTAR</a>
    `);
})

const dbcon = require('./config/connection-db');

app.listen(process.env.PORT || 3000, () => console.log(`Server iniciado na porta 3000`));