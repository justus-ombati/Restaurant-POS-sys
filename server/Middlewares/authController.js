const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');


exports.authenticate = asyncErrorHandler(async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).send({ error: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
        const data = jwt.verify(token, process.env.SECRET_STR);
        const user = await User.findById(data.id);

        if (!user) {
            return res.status(401).send({ error: 'User not found' });
        }

        req.user = user;

        if (['admin', 'manager', 'kitchen', 'waitstaff'].includes(user.role)) {
            return next();
        } else {
            return res.status(403).send({ error: 'Unauthorized access' });
        }
    } catch (error) {
        return res.status(401).send({ error: 'Invalid token! please login again' });
    }
});
