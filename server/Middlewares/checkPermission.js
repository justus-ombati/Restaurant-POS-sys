const User = require('../Models/userModel');
const Role = require('../Models/roleModel');
const CustomError = require('../Utils/customError');

const checkPermission = (action) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return next(new CustomError('User not found', 404));
            }

            const userRole = user.role;
            const role = await Role.findOne({ name: userRole });

            if (!role) {
                return next(new CustomError('Role not found', 404));
            }

            const permissions = role.permissions;

            if (!permissions.includes(action)) {
                return next(new CustomError('You do not have permission to perform this action', 403));
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = checkPermission;
