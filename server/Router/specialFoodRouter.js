const express = require('express');
const router = express.Router();
const specialFoodController = require('../Controllers/specialFoodController');
const { authenticate } = require('../Middlewares/authentication');
const checkPermission = require('../Middlewares/checkPermission');

router.use(authenticate);
// Routes requiring 'manageFood' permission
router.post('/', checkPermission('manageMenu'), specialFoodController.createSpecialFood);
router.delete('/:id', checkPermission('manageMenu'), specialFoodController.deleteSpecialFood);
router.patch('/:id', checkPermission('manageMenu'), specialFoodController.updateSpecialFood);

// Routes accessible by all users
router.get('/', specialFoodController.getAllSpecialFoods);
router.get('/:id', specialFoodController.getSpecialFood);

module.exports = router;