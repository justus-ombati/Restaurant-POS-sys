const express = require('express');
const router = express.Router();
const rolesController = require('../Controllers/rolesController');
const { authenticate } = require('../Middlewares/authentication');
const checkPermission = require('../Middlewares/checkPermission');

router.use(authenticate);


router.post('/', checkPermission('manageRoles'), rolesController.addNewRole);
router.patch('/:id', checkPermission('manageRoles'), rolesController.updateRole);
router.delete('/:id', checkPermission('manageRoles'), rolesController.deleteRole);

router.get('/', checkPermission('viewRoles'), rolesController.getAllRoles);
router.get('/:id', checkPermission('viewRoles'), rolesController.getRolePermissions);

module.exports = router;
