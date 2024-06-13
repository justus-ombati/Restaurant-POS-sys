const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: [ingredientSchema],
    steps: {
        type: [String],
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    estCost: {
        type: Number,
        required: true
    },
    estProfit: {
        type: Number,
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
