const express = require('express');
const router = express.Router();
const authenticate = require('../Controllers/authController').authenticate;
const ingController = require('../Controllers/ingController');

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
};

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes accessible only by admins
router.post('/addIngredient', checkAdmin, ingController.addIngredient);
router.delete('/deleteIngredient/:id', checkAdmin, ingController.deleteIngredient);
router.patch('/updateIngredient/:id', checkAdmin, ingController.updateIngredient);

// Routes accessible by both admins and chefs
router.get('/getAllIngredients', ingController.getAllIngredients);
router.get('/getIngredient/:id', ingController.getIngredient);

module.exports = router;
