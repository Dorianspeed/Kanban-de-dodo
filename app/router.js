const express = require('express');
const router = express.Router();

const userController = require('./controllers/userController');
const tableController = require('./controllers/tableController');
const listController = require('./controllers/listController');

// User
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getOneUser);
router.patch('/users/:id', userController.updateOneUser);
router.put('/users/:id?', userController.createOrUpdate);
router.delete('/users/:id', userController.deleteUser);

router.get('/users/:id/tables', tableController.getAllTablesFromOneUser);
router.get('/users/:userId/tables/:tableId', tableController.getOneTableFromOneUser);

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
router.delete('/lists/:id', listController.deleteTable);

module.exports = router;