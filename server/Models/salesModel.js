const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be at least 0'],
    },
    profit: {
      type: Number,
      default: 0,
      min: [0, 'Profit must be at least 0'],
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate profit
salesSchema.pre('save', async function (next) {
  try {
    const Order = mongoose.model('Order');
    const order = await Order.findById(this.orderId).populate('items.item');

    if (!order) {
      throw new Error('Invalid Order ID');
    }

    let cost = 0;

    for (const item of order.items) {
      if (item.itemType === 'Food') {
        const food = await mongoose.model('Food').findById(item.item);
        if (food) {
          cost += food.cost * item.quantity;
        } else {
          throw new Error(`Food item with ID ${item.item} not found`);
        }
      } else if (item.itemType === 'SpecialFood') {
        const specialFood = await mongoose.model('SpecialFood').findById(item.item);
        if (specialFood) {
          cost += specialFood.cost * item.quantity;
        } else {
          throw new Error(`SpecialFood item with ID ${item.item} not found`);
        }
      } else {
        throw new Error(`Unknown item type: ${item.itemType}`);
      }
    }

    this.profit = this.totalAmount - cost;
    next();
  } catch (error) {
    next(error);
  }
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;
