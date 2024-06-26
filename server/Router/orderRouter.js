const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const { authenticate } = require('../Middlewares/authentication');
const checkPermission = require('../Middlewares/checkPermission');

router.use(authenticate);

// Routes requiring 'manageOrders' permission
router.post('/', checkPermission('manageOrders'), orderController.createOrder);
router.delete('/:id', checkPermission('manageOrders'), orderController.deleteOrder);
router.patch('/:id', checkPermission('manageOrders'), orderController.updateOrder);

// Routes accessible by all users
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);

module.exports = router;