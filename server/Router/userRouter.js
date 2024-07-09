const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const {authenticate} = require('../Middlewares/authentication')
const checkPermission = require('../Middlewares/checkPermission');

// Get user details
router.post('/login', userController.login);
router.post('/register', authenticate, checkPermission('manageUser'), userController.register);
router.get('/', authenticate, checkPermission('manageUser'), userController.getAllUsers);
router.get('/:id', authenticate, checkPermission('manageUser'), userController.getUser);
router.patch('/:id', authenticate, checkPermission('manageUser'), userController.updateUser);

module.exports = router;