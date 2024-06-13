const express = require('express');
const router = express.Router();
const { authenticate } = require('../Controllers/authController');
const reportController = require('../Controllers/reportController');

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
};

// Apply authentication middleware to all routes
router.use(authenticate);

// Routes accessible only by admin users
router.get('/salesReport/:timeframe', checkAdmin, reportController.salesReport);
router.get('/profitsReport/:timeframe', checkAdmin, reportController.profitsReport);
router.get('/stockStatusReport', checkAdmin, reportController.ingredientStatus);

module.exports = router;
