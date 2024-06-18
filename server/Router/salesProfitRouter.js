const express = require('express');
const router = express.Router();
const salesProfitsController = require('../Controllers/salesProfitsController')
const {authenticate} = require('../Middlewares/authentication')
const checkPermission = require('../Middlewares/checkPermission');

router.use(authenticate);
 
router.get('/sales/daily',checkPermission('viewReports'), salesProfitsController.getdailySalesProfit);
router.get('/sales/weekly',checkPermission('viewReports'), salesProfitsController.getweeklySalesProfit);
router.get('/sales/monthly',checkPermission('viewReports'), salesProfitsController.getmonthlySalesProfit);