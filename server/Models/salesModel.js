const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount must be at least 0']
  },
  profit: {
    type: Number,
    required: [true, 'Profit is required'],
    min: [0, 'Profit must be at least 0']
  }
});

// Pre-save hook to calculate profit
salesSchema.pre('save', async function(next) {
  const Order = mongoose.model('Order');
  const order = await Order.findById(this.orderId);
  
  if (!order) {
    throw new Error('Invalid Order ID');
  }

  let cost = 0;
  for (const item of order.items) {
    if (item.itemType === 'Food') {
      const food = await mongoose.model('Food').findById(item.item);
      if (food) {
        cost += food.cost * item.quantity;
      }
    } else if (item.itemType === 'SpecialRecipe') {
      const specialRecipe = await mongoose.model('SpecialRecipe').findById(item.item);
      if (specialRecipe) {
        cost += specialRecipe.cost * item.quantity;
      }
    }
  }

  this.profit = this.totalAmount - cost;
  next();
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;