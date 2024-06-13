const express = require('express');
const router = express.Router();
const { authenticate } = require('../Controllers/authController');
const recipeController = require('../Controllers/recipeController');

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
};

// Middleware to check if user is chef
const checkChef = (req, res, next) => {
    if (req.user.role !== 'chef') {
        return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
};

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes accessible only by admins
router.post('/createRecipe', checkAdmin, recipeController.createRecipe);
router.delete('/deleteRecipe/:id', checkAdmin, recipeController.deleteRecipe);
router.patch('/updateRecipe/:id', checkAdmin, recipeController.updateRecipe);

// Route accessible only by chefs
router.post('/confirmPrep/:id', checkChef, recipeController.confirmPrep);

// Routes accessible by both chefs and admins
router.get('/getRecipe/:id', recipeController.getRecipe)
router.get('/getAllRecipes', recipeController.getAllRecipes);
router.get('/preparedRecipes', recipeController.preparedRecipes);

module.exports = router;
