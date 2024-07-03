const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const { authenticate } = require('../Middlewares/authentication');
const checkPermission = require('../Middlewares/checkPermission');

router.use(authenticate);

// Routes requiring 'manageOrders' permission
router.post('/', checkPermission('createOrder'), orderController.createOrder);
router.delete('/:id', checkPermission('deleteOrder'), orderController.deleteOrder);
router.patch('/:id', checkPermission('updateOrder'), orderController.updateOrder);
router.patch('/confirmOrder/:id', checkPermission('updateOrder'), orderController.confirmOrder);
router.patch('/completePrep/:id', checkPermission('updateOrder'), orderController.completePrep);
router.patch('/cancelOrder/:id', checkPermission('cancelOrder'), orderController.cancelOrder);
router.patch('/completePayment/:id', checkPermission('completePayment'), orderController.completePayment);

// Routes accessible by all users
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);

module.exports = router;