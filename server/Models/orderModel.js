const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  itemType: {
    type: String,
    required: true,
    enum: ['Food', 'SpecialRecipe'],
    message: 'Item type must be either Food or SpecialRecipe'
  },
  item: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'items.itemType',
    message: 'Item reference is required'
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    message: 'Quantity is required'
  }
}, { _id: false });

const orderSchema = new Schema({
  items: [orderItemSchema],
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Preparation', 'Ready', 'Cancelled', 'Completed'],
    default: 'Pending',
    message: 'Status must be one of: Pending, In Preparation, Ready, Cancelled, Completed'
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
    message: 'Customer name is required'
  },
  tableNumber: {
    type: Number,
    required: true,
    min: [1, 'Table number must be at least 1'],
    message: 'Table number is required'
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount must be at least 0'],
    message: 'Total amount is required'
  },
  message: {
    type: String,
    trim: true
  },
}, { timestamps: true });

// Pre-save hook to update the updatedAt field and calculate the totalAmount
orderSchema.pre('save', async function(next) {
  this.updatedAt = Date.now();
  let total = 0;

  for (const item of this.items) {
    if (item.itemType === 'Food') {
      const food = await mongoose.model('Food').findById(item.item);
      if (food) {
        total += food.sellingPrice * item.quantity;
      }
    } else if (item.itemType === 'SpecialRecipe') {
      const specialRecipe = await mongoose.model('SpecialRecipe').findById(item.item);
      if (specialRecipe) {
        total += specialRecipe.sellingPrice * item.quantity;
      }
    }
  }

  this.totalAmount = total;
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
