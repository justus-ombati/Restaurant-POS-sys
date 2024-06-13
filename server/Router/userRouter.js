const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Get user details
router.route('/login').post(authController.login);

module.exports = router;