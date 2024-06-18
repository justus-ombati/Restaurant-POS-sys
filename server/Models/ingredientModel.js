const mongoose = require('mongoose');

// Define the ingredient schema
const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'Another ingredient exists with the same name'],
        required: [true, 'Please provide the ingredient name'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please provide the ingredient category'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide the amount of the ingredient'],
        min: [1, 'Amount cannot be a 0']
    },
    pricePerUnit: {
        type: Number,
        required: [true, 'Please provide the price per unit of the ingredient'],
        min: [0, 'Price cannot be a 0']
    }
}, { timestamps: true });

// Create the Ingredient model
const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;