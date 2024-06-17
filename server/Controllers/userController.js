const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');  // Ensure the correct path and case
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_STR, { expiresIn: process.env.TOKEN_EXP });
};

// Login route handler
exports.login = asyncErrorHandler(async (req, res, next) => {
    const { idNumber, pin } = req.body;

    if (!idNumber || !pin) {
        return next(new CustomError("Please provide ID Number & PIN to log in!!", 400));
    }

    const user = await User.findOne({ idNumber }).select('+pin');

    if (!user) {
        console.log('User not found');
        return next(new CustomError("User with ID does not exist!", 400));
    }

    console.log('Stored Pin:', user.pin);
    console.log('Provided Pin:', pin);

    const isMatch = user.pin === pin;
    console.log('Password Match:', isMatch);

    if (!isMatch) {
        return next(new CustomError("Incorrect ID Number or PIN!!", 400));
    }

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        user: {
            id: user._id,
            idNumber: user.idNumber,
            name: user.name,
            role: user.role
        },
    });
});
// Registration route handler
exports.register = asyncErrorHandler(async (req, res, next) => {
    const { idNumber, name, pin, role } = req.body;

    if (!idNumber || !name || !pin || !role) {
        return next(new CustomError("Please provide ID Number, Name, PIN, and Role to register!!", 400));
    }

    try {
        const newUser = await User.create({
            idNumber,
            name,
            pin, // Save plain text PIN for now
            role
        });
        console.log(newUser)
        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            user: {
                id: newUser._id,
                idNumber: newUser.idNumber,
                name: newUser.name,
                role: newUser.role
            }
        });
    } catch (err) {
        console.error('Error creating user:', err);
        return next(new CustomError("Error creating user", 500));
    }
});