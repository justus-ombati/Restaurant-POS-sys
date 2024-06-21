const Food = require('../Models/foodModel');
const Ingredient = require('../Models/ingredientModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');

// Create new food
exports.createFood = asyncErrorHandler(async (req, res, next) => {
    const { name, type, ingredients, cost, sellingPrice } = req.body;

    // Ensure all required fields are provided
    if (!name || !type || ingredients == null || !cost || !sellingPrice == null) {
        return next(new CustomError('Please provide name, type, ingredints, quantity, cost, and sellingPrice for the food!', 400));
    }

    // Validate that all ingredients exist
    const ingredientIds = ingredients.map(item => item.ingredient);
    const existingIngredients = await Ingredient.find({ '_id': { $in: ingredientIds } });

    if (existingIngredients.length !== ingredientIds.length) {
        return next(new CustomError('One or more ingredients do not exist in the database!', 400));
    }

    // Create the new ingredient
    const newFood = await Food.create({
        name,
        type,
        ingredients,
        cost,
        sellingPrice
    });
    const food = await Food.create(newFood);
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
    const count =  await Food.countDocuments(1)
    res.status(200).json({
        status: 'success',
        availableFoods: count,
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

// Update food
exports.updateFood = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
  
    // Ensure all required fields are provided
    if (updateData.ingredients) {
      // Validate that all ingredients exist
      const ingredientIds = updateData.ingredients.map(item => item.ingredient);
      const existingIngredients = await Ingredient.find({ '_id': { $in: ingredientIds } });
  
      if (existingIngredients.length !== ingredientIds.length) {
        return next(new CustomError('One or more ingredients do not exist in the database!', 400));
      }
    }
  
    const updatedFood = await Food.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: 'query'
    }).populate('ingredients.ingredient');
  
    if (!updatedFood) {
      return next(new CustomError('Food item not found!', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: updatedFood
    });
  });

// Delete food by ID
exports.deleteFood = asyncErrorHandler(async (req, res, next) => {
    const foodId = req.params.id;
    if (!foodId) {
        return next(new CustomError('Food ID missing!', 400));
    }
    const food = await Food.findByIdAndDelete(foodId);

    if (!food) {
        return next(new CustomError('Food not found!', 404));
    }

    res.status(204).json({
        status: 'success',
        message: `Food item ${food.name} deleted successfully`,
        data: null
    });
});