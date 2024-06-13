// authController.js
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_STR, { expiresIn: process.env.TOKEN_EXP});
};

exports.authenticate = asyncErrorHandler(async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).send({ error: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
        const data = jwt.verify(token, process.env.SECRET_STR);
        const user = await User.findOne({ _id: data.id });

        if (!user) {
            return res.status(401).send({ error: 'User not found' });
        }

        req.user = user;

        if (user.role === 'admin' || user.role === 'chef') {
            return next();
        } else {
            return res.status(403).send({ error: 'Unauthorized access' });
        }
    } catch (error) {
        return res.status(401).send({ error: 'Invalid token! please login again' });
    }
});

// Login route handler
exports.login = asyncErrorHandler(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return next(new CustomError("Please provide Email & Password to log in!!", 400));
    }

    const user = await User.findOne({ username }).select('+password');
    if (!user || password !== user.password) {
        return next(new CustomError("Incorrect Email or Password!!", 400));
    }

    const token = signToken(user._id);
    
    res.status(200).json({
        status: 'success',
        token,
        user: {
            id: user._id,
            username: user.username
        },
    });
});
