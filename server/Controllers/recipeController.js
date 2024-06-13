
const Recipe = require('../Models/recipeModel');
const Ingredient = require('../Models/ingModel');
const ConfirmedRecipe = require('../Models/confRecipeModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');


exports.createRecipe = asyncErrorHandler(async (req, res, next) => {
    const { name, description, ingredients, steps, sellingPrice } = req.body;

    // Check if all required fields are provided
    if (!name || !description || !ingredients || !steps || !sellingPrice) {
        const error = new CustomError('All fields (name, description, ingredients, steps, sellingPrice) are required.', 400);
        return next(error);
    }

    // Calculate estCost and estProfit
    let estCost = 0;
    for (const ingredient of ingredients) {
        const ing = await Ingredient.findOne({ name: ingredient.name });
        if (!ing) {
            const error = new CustomError(`Ingredient ${ingredient.name} not found.`, 404);
            return next(error);
        }
        estCost += ing.pricePerUnit * ingredient.amount;
    }
    const estProfit = sellingPrice - estCost;

    // Create recipe document
    const newRecipe = await Recipe.create({
        name,
        description,
        ingredients,
        steps,
        sellingPrice,
        estCost,
        estProfit
    });

    return res.status(201).json({
        status: 'success',
        data: {
            recipe: newRecipe
        }
    });
});

exports.getRecipe = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    // Check if recipe ID is provided
    if (!id) {
        const error = new CustomError('Recipe ID missing.', 400);
        return next(error);
    }

    // Find the recipe by ID
    const recipe = await Recipe.findById(id);

    if (!recipe) {
        const error = new CustomError('Recipe not found', 404);
        return next(error);
    }

    return res.status(200).json({
        status: 'success',
        data: {
            recipe
        }
    });
});

exports.getAllRecipes = asyncErrorHandler(async (req, res, next) => {
    const recipes = await Recipe.find();

    if(!recipes){
        const error = new CustomError('No recipes found!', 404);
        return next(error);
    }
    const count = await Recipe.countDocuments();
    return res.status(200).json({
        status: 'success',
        recipesAvailable: count,
        data: recipes
    });
});

exports.deleteRecipe = asyncErrorHandler(async(req, res, next) => {
    const {id} = req.params;

    // Check if Recipe ID is provided
    if (!id) {
        const error = new CustomError('Recipe ID missing.', 400);
        return next(error);
    }
    // Find the Recipe by ID
    const recipeToDelete = await Recipe.findById(id);

    if (!recipeToDelete) {
        const error = new CustomError('Recipe not found', 404);
        return next(error);
    }
    //Delete the recipee
    await Recipe.findByIdAndDelete(id);

    return res.status(200).json({
        status: 'success',
        message: 'Recipe deleted successfully.'
    });
});

exports.updateRecipe = asyncErrorHandler(async (req, res, next) => {
    console.log('endpoint reached')
    const { id } = req.params;
    const { ingredients, sellingPrice, description, steps  } = req.body;

    // Check if recipe ID is provided
    if (!id) {
        const error = new CustomError('Recipe ID missing.', 400);
        return next(error);
    }

    // Check if all required fields are provided
    if (!ingredients || !sellingPrice || !description || !steps) {
        const error = new CustomError('Missing required field, please confirm if ingredients, sellingPrice, description and steps are present.', 400);
        return next(error);
    }

    // Calculate estCost and estProfit
    let estCost = 0;
    for (const ingredient of ingredients) {
        const ing = await Ingredient.findOne({ name: ingredient.name });
        if (!ing) {
            const error = new CustomError(`Ingredient ${ingredient.name} not found.`, 404);
            return next(error);
        }
        estCost += ing.pricePerUnit * ingredient.amount;
    }
    const estProfit = sellingPrice - estCost;

    // Update recipe document
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, {
        ingredients,
        description,
        steps,
        sellingPrice,
        estCost,
        estProfit,
    }, { new: true });

    return res.status(200).json({
        status: 'success',
        data: {
            recipe: updatedRecipe
        }
    });
});

exports.confirmPrep = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { numberOfPeople } = req.body

    // Check if recipe ID is provided
    if (!id) {
        const error = new CustomError('Recipe ID missing.', 400);
        return next(error);
    }

    // Find the recipe by ID
    const recipe = await Recipe.findById(id);

    // Check if recipe with given ID exists
    if (!recipe) {
        const error = new CustomError('Recipe not found.', 404);
        return next(error);
    }
    
    console.log('req.body.numberOfPeople:', req.body.numberOfPeople);
    const orgEstCost = recipe.estCost
    const orgSellingPrice = recipe.sellingPrice
    // Calculate estCost and estProfit
    const estCost = orgEstCost * numberOfPeople;
    const sellingPrice = orgSellingPrice * numberOfPeople;
    const estProfit = sellingPrice - estCost;

    console.log('estCost: ', estCost);
    console.log('sellingPrice: ', sellingPrice);
    console.log('estProfit: ', estProfit);

    // Update ingredients in the Ingredients collection
    for (const ingredient of recipe.ingredients) {
        const { name, amount } = ingredient;
        console.log('Processing ingredient:', name); // Added log message for debugging
    
        if (amount == null || isNaN(amount)) {
          // If the amount is null, undefined, or not a valid number, skip this ingredient
          console.log(`Skipping ingredient ${name} with invalid amount: ${amount}`);
          continue;
        }
        console.log(amount)
        console.log(numberOfPeople)

        const amountUsed = amount * numberOfPeople;

        console.log(amountUsed)
    
        if (isNaN(amountUsed)) {
          console.error(`Invalid amount for ingredient ${name}: ${amount}`); // Added error log message for debugging
          const error = new CustomError(`Invalid amount for ingredient ${name}`, 400);
          return next(error);
        }
    
        await Ingredient.updateOne({ name }, { $inc: { amount: -amountUsed } });
      }

    // Create a confirmed recipe document
    const confirmedRecipe = new ConfirmedRecipe({
        recipeName: recipe.name,
        numberOfPeople: numberOfPeople || 1, // Default to 1 person if not provided
        ingredients: recipe.ingredients,
        preparedAt: new Date(),
        confirmedBy: req.user.username, // You should replace this with the actual chef's name
        estCost,
        sellingPrice,
        estProfit,
        chefId: req.user._id
    });

    // Save the confirmed recipe
    await confirmedRecipe.save();

    return res.status(200).json({
        status: 'success',
        message: 'Recipe confirmed and moved to ConfirmedPrep collection.',
        data: {
            confirmedRecipe
        }
    });
});

exports.preparedRecipes = asyncErrorHandler(async (req, res) => {
    let query = {};

    // Check if user is an admin
    if (req.user.role === 'admin') {
        // Fetch all confirmed recipes with recipe name, date prepared, and chef's name
        const recipes = await ConfirmedRecipe.find({}, { recipeName: 1, preparedAt: 1, confirmedBy: 1 });

        return res.status(200).json({
            status: 'success',
            data: {
                recipes
            }
        });
    } else {
        // Fetch confirmed recipes for the particular chef with recipe name and date prepared
        query = { chefId: req.user._id };
        const recipes = await ConfirmedRecipe.find(query, { recipeName: 1, preparedAt: 1 });

        return res.status(200).json({
            status: 'success',
            data: {
                recipes
            }
        });
    }
});

