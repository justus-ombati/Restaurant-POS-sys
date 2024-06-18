const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const {authenticate} = require('../Middlewares/authentication')
const checkPermission = require('../Middlewares/checkPermission');

// Get user details
router.post('/login', userController.login);
router.post('/register', authenticate, checkPermission('createUser'), userController.register);

module.exports = router;