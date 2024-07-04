const mongoose = require('mongoose');
const Role = require('../models/roleModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');

// Get all roles and their permissions
exports.getAllRoles = asyncErrorHandler(async (req, res, next) => {
  const roles = await Role.find({});
  res.status(200).json(roles);
});
// Get the permissions of one role by ID
exports.getRolePermissions = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError('Invalid Role ID', 400));
  }
  const role = await Role.findById(id);
  if (!role) {
    return next(new CustomError('Role not found', 404));
  }
  res.status(200).json(role.permissions);
});
// Update the permissions of a role
exports.updateRole = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { permissions } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError('Invalid Role ID', 400));
  }

  const role = await Role.findByIdAndUpdate(
    id,
    { permissions },
    { new: true, runValidators: true }
  );

  if (!role) {
    return next(new CustomError('Role not found', 404));
  }

  res.status(200).json(role);
});
// Add a new role and its permissions
exports.addNewRole = asyncErrorHandler(async (req, res, next) => {
  const { name, permissions } = req.body;

  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    return next(new CustomError('Role already exists', 400));
  }

  const newRole = new Role({ name, permissions });
  await newRole.save();

  res.status(201).json(newRole);
});

// Delete an entire role
exports.deleteRole = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError('Invalid Role ID', 400));
  }

  const role = await Role.findByIdAndDelete(id);
  if (!role) {
    return next(new CustomError('Role not found', 404));
  }

  res.status(204).json({ message: 'Role deleted successfully' });
});
