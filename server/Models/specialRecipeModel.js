const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const specialRecipeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true
  },
  origin: {
    type: String,
    required: [true, 'Recipe origin is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  ingredients: [{
    ingredient: {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: [true, 'Ingredient is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Ingredient quantity is required'],
      min: [0, 'Ingredient quantity must be at least 0']
    }
  }],
  steps: [{
    type: String,
    required: [true, 'Step is required']
  }],
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [0, 'Cost must be at least 0']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Selling price must be at least 0'],
    validate: {
      validator: function(v) {
        return v > this.cost;
      },
      message: props => `Selling price (${props.value}) should be higher than cost (${this.cost})!`
    }
  }
}, { timestamps: true });

// Pre-save hook to calculate cost based on ingredients
specialRecipeSchema.pre('save', async function(next) {
  if (this.isModified('ingredients')) {
    let totalCost = 0;
    for (const item of this.ingredients) {
      const ingredient = await mongoose.model('Ingredient').findById(item.ingredient);
      if (ingredient) {
        totalCost += ingredient.pricePerUnit * item.quantity;
      }
    }
    this.cost = totalCost;
  }
  next();
});

const SpecialRecipe = mongoose.model('SpecialRecipe', specialRecipeSchema);

module.exports = SpecialRecipe;
