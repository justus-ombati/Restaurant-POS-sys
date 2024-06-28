const express = require('express');
const router = express.Router();
const salesController = require('../Controllers/salesController');
const { authenticate } = require('../Middlewares/authentication');
const checkPermission = require('../Middlewares/checkPermission');

router.use(authenticate);

router.get('/daily', checkPermission('viewReports'), salesController.getdailySalesProfit);
router.get('/weekly', checkPermission('viewReports'), salesController.getweeklySalesProfit);
router.get('/monthly', checkPermission('viewReports'), salesController.getmonthlySalesProfit);
router.post('/addSale', checkPermission('addSale'), salesController.addSale);


module.exports = router;