const User = require('../Models/userModel');
const roles = require('../config/roles');
const CustomError = require('../Utils/customError');

const checkPermission = (action) => {
    return async (req, res, next) => {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new CustomError('User not found', 404));
        }

        const userRole = user.role;
        const permissions = roles[userRole];

        if (!permissions.includes(action)) {
            return next(new CustomError('You do not have permission to perform this action', 403));
        }

        next();
    };
};

module.exports = checkPermission;