// Importation des dépendances nécessaires
const express = require('express');
const router = express.Router();

// Importation des controllers
const userController = require('./controllers/userController');
const tableController = require('./controllers/tableController');
const listController = require('./controllers/listController');
const cardController = require('./controllers/cardController');
const tagController = require('./controllers/tagController');
const loginController = require('./controllers/loginController');

// Importation des middlewares
const isLoggedInMiddleware = require('./middlewares/isLoggedIn');
const isLoggedOutMiddleware = require('./middlewares/isLoggedOut');

// Middleware vérifiant si l'utilisateur est connecté, si oui, on redirige vers /kanban
router.use(isLoggedInMiddleware);

// Route GET menant au formulaire de connexion
router.get('/login', (request, response) => {
    response.sendFile('login.html', {
        root: 'public'
    });
});

// Route GET menant au formulaire d'inscription
router.get('/register', (request, response) => {
    response.sendFile('register.html', {
        root: 'public'
    });
});

// Route POST gérant la connexion à l'application
router.post('/login', loginController.login);

// Route POST gérant la création d'un utilisateur
router.post('/users', userController.createUser);

// Middleware vérifiant si l'utilisateur est déconnecté, si oui, on redirige vers /login
router.use(isLoggedOutMiddleware);

// Route GET menant à l'application Kanban
router.get('/kanban', (request, response) => {
    response.sendFile('kanban.html', {
        root: 'public'
    });
});

// Routes User
router.get('/userTables', tableController.getAllTablesFromOneUser);

// Routes Table
router.post('/tables', tableController.createTable);

router.get('/tables/:id', tableController.getOneTable);
router.patch('/tables/:id', tableController.updateOneTable);
router.delete('/tables/:id', tableController.deleteTable);

// Routes List
router.post('/lists', listController.createList);

router.patch('/lists/:id', listController.updateOneList);
router.delete('/lists/:id', listController.deleteList);

// Routes Card
router.post('/cards', cardController.createCard);

router.patch('/cards/:id', cardController.updateOneCard);
router.delete('/cards/:id', cardController.deleteCard);

// Routes Tag
router.post('/tags', tagController.createTag);

router.get('/userTags', tagController.getAllTagsFromOneUser);

router.patch('/tags/:id', tagController.updateOneTag);
router.delete('/tags/:id', tagController.deleteTag);

router.post('/cards/:id/tags', tagController.associateTagToCard);
router.delete('/cards/:cardId/tags/:tagId', tagController.removeTagFromCard);

// Route gérant la déconnexion
router.get('/disconnect', loginController.disconnect);

// Routes créées mais non utilisées
/*
User

router.get('/users', userController.getAllUsers);

router.get('/users/:id', userController.getOneUser);
router.patch('/users/:id', userController.updateOneUser);
router.put('/users/:id?', userController.createOrUpdate);
router.delete('/users/:id', userController.deleteUser);

Table
router.get('/tables', tableController.getAllTables);

router.put('/tables/:id?', tableController.createOrUpdate);

List

router.get('/lists', listController.getAllLists);

router.get('/lists/:id', listController.getOneList);
router.put('/lists/:id?', listController.createOrUpdate);

Card

router.get('/cards', cardController.getAllCards);

router.get('/cards/:id', cardController.getOneCard);
router.put('/cards/:id?', cardController.createOrUpdate);

Tag

router.get('/tags', tagController.getAllTags);

router.get('/tags/:id', tagController.getOneTag);
router.put('/tags/:id?', tagController.createOrUdpate);
*/

// Exportation du module
module.exports = router;