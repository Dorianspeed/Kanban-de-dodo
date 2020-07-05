const express = require('express');
const router = express.Router();

const userController = require('./controllers/userController');
const tableController = require('./controllers/tableController');
const listController = require('./controllers/listController');
const cardController = require('./controllers/cardController');
const tagController = require('./controllers/tagController');
const loginController = require('./controllers/loginController');

// User
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);

router.get('/users/:id', userController.getOneUser);
router.patch('/users/:id', userController.updateOneUser);
router.put('/users/:id?', userController.createOrUpdate);
router.delete('/users/:id', userController.deleteUser);

router.get('/users/:id/tables', tableController.getAllTablesFromOneUser);

// Table
router.get('/tables', tableController.getAllTables);
router.post('/tables', tableController.createTable);

router.get('/tables/:id', tableController.getOneTable);
router.patch('/tables/:id', tableController.updateOneTable);
router.put('/tables/:id?', tableController.createOrUpdate);
router.delete('/tables/:id', tableController.deleteTable);

// List
router.get('/lists', listController.getAllLists);
router.post('/lists', listController.createList);

router.get('/lists/:id', listController.getOneList);
router.patch('/lists/:id', listController.updateOneList);
router.put('/lists/:id?', listController.createOrUpdate);
router.delete('/lists/:id', listController.deleteList);

// Card
router.get('/cards', cardController.getAllCards);
router.post('/cards', cardController.createCard);

router.get('/cards/:id', cardController.getOneCard);
router.patch('/cards/:id', cardController.updateOneCard);
router.put('/cards/:id?', cardController.createOrUpdate);
router.delete('/cards/:id', cardController.deleteCard);

// Tag
router.get('/tags', tagController.getAllTags);
router.post('/tags', tagController.createTag);

router.get('/tags/:id', tagController.getOneTag);
router.patch('/tags/:id', tagController.updateOneTag);
router.put('/tags/:id?', tagController.createOrUdpate);
router.delete('/tags/:id', tagController.deleteTag);

router.post('/cards/:id/tags', tagController.associateTagToCard);
router.delete('/cards/:cardId/tags/:tagId', tagController.removeTagFromCard);

// Login / Disconnect
router.post('/login', loginController.login);

router.get('/disconnect', loginController.disconnect);

module.exports = router;