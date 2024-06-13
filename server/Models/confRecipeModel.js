const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: String,
    amount: Number,
});

const confirmedRecipeSchema = new mongoose.Schema({
    recipeName: String,
    numberOfPeople: Number,
    ingredients: [ingredientSchema],
    preparedAt: {
        type: Date,
        default: Date.now
    },
    confirmedBy: String,
    estCost: Number,
    sellingPrice: Number,
    estProfit: Number,
    chefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming 'User' is the model for the chef
    }
});

const ConfirmedRecipe = mongoose.model('ConfirmedRecipe', confirmedRecipeSchema);

module.exports = ConfirmedRecipe;
