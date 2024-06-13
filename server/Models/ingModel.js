const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Ingredient name is required'],
        unique: [true, 'Ingredient name already exists'],
        trim: true,
    },

    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },

    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        trim: true,
    },

    pricePerUnit:{
        type: Number,
        required: [true, 'Price is required'],
        trim: true,
    },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
