const Order = require('../models/orderModel');
const Food = require('../models/foodModel');
const SpecialRecipe = require('../models/specialRecipeModel');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/customError');

// Create new order
exports.createOrder = asyncErrorHandler(async (req, res, next) => {
  const { items, customerName, tableNumber, message } = req.body;

  // Ensure all required fields are provided
  if (!items || items.length === 0 || !customerName || !tableNumber) {
    return next(new CustomError('Please provide items, customer name, and table number for the order!', 400));
  }

  // Validate items and calculate total amount
  let totalAmount = 0;
  for (const item of items) {
    if (!item.itemType || !item.item || !item.quantity) {
      return next(new CustomError('Each item must have itemType, item, and quantity fields!', 400));
    }

    if (item.itemType === 'Food') {
      const food = await Food.findById(item.item);
      if (!food) {
        return next(new CustomError(`Food item with ID ${item.item} not found!`, 404));
      }
      totalAmount += food.sellingPrice * item.quantity;
    } else if (item.itemType === 'SpecialRecipe') {
      const specialRecipe = await SpecialRecipe.findById(item.item);
      if (!specialRecipe) {
        return next(new CustomError(`SpecialRecipe item with ID ${item.item} not found!`, 404));
      }
      totalAmount += specialRecipe.sellingPrice * item.quantity;
    } else {
      return next(new CustomError('Item type must be either Food or SpecialRecipe!', 400));
    }
  }

  // Create the new order
  const newOrder = await Order.create({
    items,
    status: 'Pending',
    customerName,
    tableNumber,
    totalAmount,
    message
  });

  res.status(201).json({
    status: 'success',
    data: newOrder
  });
});

// Get all orders
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
    const orders = await Order.find()
      .populate('items.item')
      .sort({ createdAt: -1 }); // Sort by most recent orders
  
    if (!orders) {
      return next(new CustomError('No orders found!', 404));
    }
  
    const count = await Order.countDocuments();
  
    res.status(200).json({
      status: 'success',
      totalOrders: count,
      data: orders
    });
});

// Get one order by ID
exports.getOrder = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
  
    const order = await Order.findById(id).populate('items.item');
  
    if (!order) {
      return next(new CustomError('Order not found!', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: order
    });
});

// Update an order by ID
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    // Validate the updated items
    if (updateData.items) {
        const itemIds = updateData.items.map(item => item.item);
        const existingItems = await mongoose.model('Food').find({ '_id': { $in: itemIds } }).concat(await mongoose.model('SpecialRecipe').find({ '_id': { $in: itemIds } }));

        if (existingItems.length !== itemIds.length) {
            return next(new CustomError('One or more items do not exist in the database!', 400));
        }
    }

    const order = await Order.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
        context: 'query'
    }).populate('items.item');

    if (!order) {
        return next(new CustomError('Order not found!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: order
    });
});

// Delete an order by ID
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
        return next(new CustomError('Order not found!', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});