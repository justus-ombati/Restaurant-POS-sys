const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Food type is required'],
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
      min: [1, 'Ingredient quantity must be at least 1']
    }
  }],
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [0, 'Cost must be at least 0'],
    default: 0
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
foodSchema.pre('save', async function(next) {
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

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
