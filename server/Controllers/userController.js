const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');  // Ensure the correct path and case
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');
const { response } = require('express');

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
        return next(new CustomError("User with ID does not exist!", 404));
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

    const newUser = await User.create({
        idNumber,
        name,
        pin, // Save plain text PIN for now
        role
    });
    console.log(newUser)

    res.status(201).json({
        status: 'success',
        user: {
            id: newUser._id,
            idNumber: newUser.idNumber,
            name: newUser.name,
            role: newUser.role
        }
    });

});

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
    const users = await User.find();
    if(!users || users.length===0 ){
        return next(new CustomError("Users not found", 404));
    }

    res.status(200).json({
        status: 'success',
        data: users
    });
});

exports.getUser = asyncErrorHandler( async(req, res, next) =>{
    const { id } = req.params;
    if(!id){
        return next(new CustomError("User Id missing!", 400));
    }

    const user = await User.findById(id).lean(); // Use .lean() to exclude Mongoose internals
    if(!user){
        return next(new CustomError("User not found!", 404));
    }

    res.status(200).json({
        status: 'success',
        data: user
    });
});

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, pin, role } = req.body; // Assuming these are the fields to update
  
    if (!id) {
      return next(new CustomError("User Id missing!", 400));
    }
  
    const user = await User.findByIdAndUpdate(
      id,
      { name, pin, role }, // Update these fields
      { new: true, runValidators: true } // Return the updated document and run validation
    );
  
    if (!user) {
      return next(new CustomError("User not found!", 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: user
    });
  });