const CustomError = require('../Utils/customError');
const ConfirmedRecipes = require('../Models/confRecipeModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const Ingredient = require('../Models/ingModel');

exports.salesReport = asyncErrorHandler(async (req, res, next) => {
    let startDate, endDate;

    const { timeframe } = req.params;
    console.log('backend timeframe: ', timeframe);

    // Set start and end dates based on the selected time frame
    switch (timeframe) {
        case 'hourly':
            startDate = new Date();
            startDate.setHours(6, 0, 0, 0); // Start from 6am today
            endDate = new Date();
            endDate.setHours(22, 0, 0, 0); // End at 10pm today
            break;
        case 'daily':
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7); // Last 7 days
            endDate = new Date();
            break;
        case 'weekly':
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 28); // Last 4 weeks
            endDate = new Date();
            break;
        case 'monthly':
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 6); // Last 6 months
            endDate = new Date();
            break;
        default:
            startDate = new Date(0); // Start from the beginning of time
            endDate = new Date();
            break;
    }

    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    // Fetch confirmed recipes within the specified timeframe
    const recipes = await ConfirmedRecipes.find({
        preparedAt: { $gte: startDate, $lte: endDate }
    });

    console.log('Recipes found:', recipes);

    // Calculate total sales value
    let totalSales = 0;
    recipes.forEach(recipe => {
        totalSales += recipe.sellingPrice;
    });

    console.log('Total Sales:', totalSales);

    // Prepare sales report response
    const salesReport = {
        sales: totalSales,
        timeframe: timeframe
    };
    console.log('salesReport: ', salesReport);

    res.status(200).json({
        status: 'success',
        data: salesReport,
    });
});


exports.profitsReport = asyncErrorHandler(async (req, res, next) => {
    let startDate, endDate;

    const timeframe = req.params
    // Set start and end dates based on the selected time frame
    switch (timeframe) {
        case 'hourly':
            startDate = new Date();
            startDate.setHours(6, 0, 0, 0); // Start from 6am today
            endDate = new Date();
            endDate.setHours(22, 0, 0, 0); // End at 10pm today
            break;
        case 'daily':
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7); // Last 7 days
            endDate = new Date();
            break;
        case 'weekly':
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 28); // Last 4 weeks
            endDate = new Date();
            break;
        case 'monthly':
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 6); // Last 6 months
            endDate = new Date();
            break;
        default:
            startDate = new Date(0); // Start from the beginning of time
            endDate = new Date();
            break;
    }

    // Fetch confirmed recipes within the specified timeframe
    const recipes = await ConfirmedRecipes.find({
        preparedAt: { $gte: startDate, $lte: endDate }
    });

    // Calculate total profits
    let totalProfits = 0;
    recipes.forEach(recipe => {
        totalProfits += recipe.estProfit;
    });

    // Prepare profits report response
    const profitsReport = {
        profits: totalProfits,
        timeframe: req.query.timeframe
    };

    res.status(200).json({
        status: 'success',
        data: profitsReport
    });
});

exports.ingredientStatus = asyncErrorHandler(async (req, res, next) => {
    try {
        // Fetch all ingredients from the Ingredients collection
        const ingredients = await Ingredient.find();

        if (!ingredients) {
            const error = new CustomError('Ingredients not found.', 404);
            return next(error);
        }

        // Iterate over each ingredient to determine its status
        const ingredientsWithStatus = ingredients.map(ingredient => {
            let statusMessage = '';
            if (ingredient.amount > 3) {
                statusMessage = 'in plenty';
            } else if (ingredient.amount > 0) {
                statusMessage = 'almost out of stock';
            } else {
                statusMessage = 'out of stock';
            }

            return {
                ingredientName: ingredient.name,
                amount: ingredient.amount,
                status: statusMessage
            };
        });

        return res.status(200).json({
            status: 'success',
            data: ingredientsWithStatus
        });
    } catch (error) {
        return next(error);
    }
});