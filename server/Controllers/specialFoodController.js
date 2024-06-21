const SpecialFood = require('../Models/specialFoodModel'); // Ensure the correct path
const Ingredient = require('../Models/ingredientModel'); // Ensure the correct path
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');

exports.createSpecialFood = asyncErrorHandler(async (req, res, next) => {
    const { name, type, description, origin, ingredients, steps,sellingPrice } = req.body;

    // Ensure all required fields are provided
    if (!name || !type || !description || !origin || !steps || !ingredients || sellingPrice == null) {
        return next(new CustomError('Please provide name, type, description, origin, ingredients, steps,  and sellingPrice for the special food!', 400));
    }

    // Validate that all ingredients exist
    const ingredientIds = ingredients.map(item => item.ingredient);
    const existingIngredients = await Ingredient.find({ '_id': { $in: ingredientIds } });

    if (existingIngredients.length !== ingredientIds.length) {
        return next(new CustomError('One or more ingredients do not exist in the database!', 400));
    }

    // Create the new special food item
    const newSpecialFood = await SpecialFood.create({
        name,
        type,
        description,
        origin,
        ingredients,
        steps,
        
        sellingPrice
    });

    res.status(201).json({
        status: 'success',
        data: newSpecialFood
    });
});

exports.getAllSpecialFoods = asyncErrorHandler(async (req, res, next) => {
    const specialFoods = await SpecialFood.find().populate('ingredients.ingredient');

    if (!specialFoods || specialFoods.length === 0) {
        return next(new CustomError('No special foods found!', 404));
    }

    const count = await SpecialFood.countDocuments();

    res.status(200).json({
        status: 'success',
        availableSpecialFoods: count,
        data: specialFoods
    });
});

exports.getSpecialFood = asyncErrorHandler(async (req, res, next) => {
    const specialFoodId = req.params.id;

    const specialFood = await SpecialFood.findById(specialFoodId).populate('ingredients.ingredient');

    if (!specialFood) {
        return next(new CustomError('Special food not found!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: specialFood
    });
});

exports.updateSpecialFood = asyncErrorHandler(async (req, res, next) => {
    const specialFoodId = req.params.id;
    const { name, type, ingredients,  sellingPrice, description, origin, steps } = req.body;

    // Ensure all required fields are provided
    if (!name || !type || ingredients == null || !sellingPrice == null || !description || !origin || !steps) {
        return next(new CustomError('Please provide name, type, ingredients,  sellingPrice, description, origin, and steps for the special food!', 400));
    }

    // Validate that all ingredients exist
    const ingredientIds = ingredients.map(item => item.ingredient);
    const existingIngredients = await Ingredient.find({ '_id': { $in: ingredientIds } });

    if (existingIngredients.length !== ingredientIds.length) {
        return next(new CustomError('One or more ingredients do not exist in the database!', 400));
    }

    // Update the special food item
    const updatedSpecialFood = await SpecialFood.findByIdAndUpdate(
        specialFoodId,
        {
            name,
            type,
            ingredients,
            
            sellingPrice,
            description,
            origin,
            steps
        },
        { new: true, runValidators: true }
    ).populate('ingredients.ingredient');

    if (!updatedSpecialFood) {
        return next(new CustomError('Special food not found!', 404));
    }

    res.status(200).json({
        status: 'success',
        message: `${updatedSpecialFood.name} updated successfully`,
        data: updatedSpecialFood
    });
});

exports.deleteSpecialFood = asyncErrorHandler(async (req, res, next) => {
    const specialFoodId = req.params.id;

    // Find and delete the special food item by ID
    const deletedSpecialFood = await SpecialFood.findByIdAndDelete(specialFoodId);

    if (!deletedSpecialFood) {
        return next(new CustomError('Special food not found!', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Special food item deleted successfully!',
        data: null
    });
});