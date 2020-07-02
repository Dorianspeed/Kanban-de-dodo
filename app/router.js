const express = require('express');
const router = express.Router();

const userController = require('./controllers/userController');

router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getOneUser);
router.patch('/users/:id', userController.updateOneUser);
router.put('/users/:id?', userController.createOrUpdate);

module.exports = router;