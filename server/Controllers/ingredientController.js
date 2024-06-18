const Ingredient = require('../Models/ingredientModel'); // Ensure the correct path and case
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');

exports.getAllIngredients = asyncErrorHandler(async (req, res, next) => {
    const ingredients = await Ingredient.find();

    if (!ingredients || ingredients.length === 0) {
        const error = new CustomError('No ingredients found!', 404);
        return next(error);
    }

    const count = await Ingredient.countDocuments();
    return res.status(200).json({
        status: 'success',
        ingredientsAvailable: count,
        data: ingredients
    });
});

exports.getIngredient = asyncErrorHandler(async (req, res, next) => {
    const ingredientId = req.params.id;

    const ingredient = await Ingredient.findById(ingredientId);

    if (!ingredient) {
        const error = new CustomError('Ingredient not found!', 404);
        return next(error);
    }

    return res.status(200).json({
        status: 'success',
        data: ingredient
    });
});

exports.updateIngredient = asyncErrorHandler(async (req, res, next) => {
    const ingredientId = req.params.id;
    const updatedData = req.body;

    if (!ingredientId) {
        const error = new CustomError('Ingredient ID missing', 400);
        return next(error);
    }

    const ingredient = await Ingredient.findByIdAndUpdate(ingredientId, updatedData, {
        new: true, // Return the updated document
        runValidators: true // Run schema validators on update
    });

    if (!ingredient) {
        const error = new CustomError('Ingredient not found!', 404);
        return next(error);
    }

    return res.status(200).json({
        status: 'success',
        data: ingredient
    });
});

exports.createIngredient = asyncErrorHandler(async (req, res, next) => {
    const { name, category, amount, pricePerUnit } = req.body;

    // Ensure all required fields are provided
    if (!name || !category || amount == null || pricePerUnit == null) {
        return next(new CustomError('Please provide name, category, amount, and price per unit for the ingredient!', 400));
    }

    // Create the new ingredient
    const newIngredient = await Ingredient.create({
        name,
        category,
        amount,
        pricePerUnit
    });

    // Return the response
    return res.status(201).json({
        status: 'success',
        message: `Ingredient ${newIngredient.name} added successfully`,
        data: newIngredient
    });
});

exports.deleteIngredient = asyncErrorHandler(async (req, res, next) => {
    const ingredientId = req.params.id;

    if (!ingredientId) {
        const error = new CustomError('Ingredient ID missing', 400);
        return next(error);
    }
    const ingredient = await Ingredient.findByIdAndDelete(ingredientId);

    if (!ingredient) {
        const error = new CustomError('Ingredient not found!', 404);
        return next(error);
    }

    return res.status(200).json({
        status: 'success',
        message: `Ingredient ${ingredient.name} deleted successfully`,
    });
});