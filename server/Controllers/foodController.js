const Food = require('../Models/foodModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');

// Create new food
exports.createFood = asyncErrorHandler(async (req, res, next) => {
    const { name, type, ingredients, cost, sellingPrice } = req.body;

    // Ensure all required fields are provided
    if (!name || !type || ingredints == null || !quantity || !cost || !sellingPrice == null) {
        return next(new CustomError('Please provide name, type, ingredints, quantity, cost, and sellingPrice for the food!', 400));
    }

    // Create the new ingredient
    const newFood = await Food.create({
        name,
        type,
        ingredints,
        quantity,
        cost,
        sellingPrice
    });
    const food = await Food.create(foodData);
    res.status(201).json({
        status: 'success',
        data: food
    });
});

// Get all foods
exports.getAllFoods = asyncErrorHandler(async (req, res, next) => {
    const foods = await Food.find().populate('ingredients.ingredient');

    if (!foods) {
        return next(new CustomError('No foods found!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: foods
    });
});

// Get a single food by ID
exports.getFood = asyncErrorHandler(async (req, res, next) => {
    const foodId = req.params.id;
    if (!foodId) {
        return next(new CustomError('Food ID missing!', 400));
    }
    const food = await Food.findById(foodId).populate('ingredients.ingredient');

    if (!food) {
        return next(new CustomError('Food not found!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: food
    });
});

// Update food by ID
exports.updateFood = asyncErrorHandler(async (req, res, next) => {
    const { name, type, ingredients, cost, sellingPrice } = req.body;

    // Ensure all required fields are provided
    if (!name || !type || !ingredients || cost == null || sellingPrice == null) {
        return next(new CustomError('Please provide name, type, ingredients, cost, and sellingPrice for the food!', 400));
    }

    const food = await Food.findByIdAndUpdate(
        req.params.id,
        { name, type, ingredients, cost, sellingPrice },
        { new: true, runValidators: true }
    );

    if (!food) {
        return next(new CustomError('Food not found!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: food
    });
});

// Delete food by ID
exports.deleteFood = asyncErrorHandler(async (req, res, next) => {
    const foodId = req.params.id;
    if (!foodId) {
        return next(new CustomError('Food ID missing!', 400));
    }
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
        return next(new CustomError('Food not found!', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});