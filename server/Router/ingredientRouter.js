const express = require('express');
const router = express.Router();
const {authenticate} = require('../Middlewares/authentication');
const checkPermission = require('../Middlewares/checkPermission');
const ingredientController = require('../Controllers/ingredientController');

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes accessible only by admins
router.post('/', checkPermission('manageInventory'), ingredientController.createIngredient);
router.delete('/:id', checkPermission('manageInventory'), ingredientController.deleteIngredient);
router.patch('/:id', checkPermission('manageInventory'), ingredientController.updateIngredient);

// Routes accessible by both admins and chefs
router.get('/', ingredientController.getAllIngredients);
router.get('/:id', ingredientController.getIngredient);

module.exports = router;
