const express = require('express');
const router = express.Router();
const foodController = require('../Controllers/foodController');
const { authenticate } = require('../Middlewares/authentication');
const checkPermission = require('../Middleware/checkPermission');

router.use(authenticate);
// Routes requiring 'manageFood' permission
router.post('/', checkPermission('manageMenu'), foodController.createFood);
router.delete('/:id', checkPermission('manageMenu'), foodController.deleteFood);
router.patch('/:id', checkPermission('manageMenu'), foodController.updateFood);

// Routes accessible by all users
router.get('/', foodController.getAllFoods);
router.get('/:id', foodController.getFood);

module.exports = router;