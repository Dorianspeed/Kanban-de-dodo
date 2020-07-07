// Importation des dépendances nécessaires
require('dotenv').config();
const express = require('express');
const router = require('./app/router');
const session = require('express-session');
const multer = require('multer');
const bodyParser = multer();

// Mise en place d'express
const app = express();
const PORT = process.env.PORT || 5050;

// Mise en place du body parser d'express
app.use(express.urlencoded({ extended: true }));

// Mise en place du body parser de multer
app.use(bodyParser.none());

// Mise en place des fichiers statiques
app.use(express.static(__dirname + '/public'));

// Mise en place de la session
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'Le secret du Kanban',
    cookie: {
        secure: false,
        maxAge: (1000*60*60)
    }
}));

// Mise en place du router
app.use(router);

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});