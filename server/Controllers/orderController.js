const mongoose = require('mongoose');
const Order = require('../Models/orderModel');
const Food = require('../Models/foodModel');
const SpecialFood = require('../Models/specialFoodModel');
const Ingredient = require('../Models/ingredientModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');

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
    } else if (item.itemType === 'SpecialFood') {
      const specialFood = await SpecialFood.findById(item.item);
      if (!specialFood) {
        return next(new CustomError(`SpecialFood item with ID ${item.item} not found!`, 404));
      }
      totalAmount += specialFood.sellingPrice * item.quantity;
    } else {
      return next(new CustomError('Item type must be either Food or SpecialFood!', 400));
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
  const { status } = req.query;

  let query = {};
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('items.item')
    .sort({ createdAt: -1 }); // Sort by most recent orders

  const count = await Order.countDocuments(query);

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
  const { items, customerName, tableNumber, message } = req.body;

  // Ensure all required fields are provided
  if (!items || !customerName || !tableNumber) {
      return next(new CustomError('Please provide items, status, customerName, and tableNumber for the order!', 400));
  }

  // Validate that all items exist
  const foodItemIds = items.filter(item => item.itemType === 'Food').map(item => item.item);
  const specialFoodItemIds = items.filter(item => item.itemType === 'SpecialFood').map(item => item.item);

  const existingFoodItems = await Food.find({ '_id': { $in: foodItemIds } });
  const existingSpecialFoodItems = await SpecialFood.find({ '_id': { $in: specialFoodItemIds } });

  if (existingFoodItems.length !== foodItemIds.length || existingSpecialFoodItems.length !== specialFoodItemIds.length) {
      return next(new CustomError('One or more items do not exist in the database!', 400));
  }

  // Calculate the total amount
  let totalAmount = 0;
  for (const item of items) {
      if (item.itemType === 'Food') {
          const food = existingFoodItems.find(f => f._id.toString() === item.item.toString());
          totalAmount += food.sellingPrice * item.quantity;
      } else if (item.itemType === 'SpecialFood') {
          const specialFood = existingSpecialFoodItems.find(f => f._id.toString() === item.item.toString());
          totalAmount += specialFood.sellingPrice * item.quantity;
      }
  }

  // Update the order
  const order = await Order.findByIdAndUpdate(
      req.params.id,
      { items, customerName, tableNumber, message, totalAmount },
      { new: true, runValidators: true }
  ).populate('items.item');

  if (!order) {
      return next(new CustomError('Order not found!', 404));
  }

  res.status(200).json({
      status: 'success',
      message: 'Order updated successfully!',
      data: order
  });
});

exports.cancelOrder =  asyncErrorHandler(async(req, res, next) =>{
  const { id } = req.params;

  // Find the order by ID
  const order = await Order.findById(id).populate('items.item');

  if(!order){
    return next(new CustomError('Order not found!', 404))
  }

  if (order.status === 'In Preparation'){
    return next(new CustomError('Order is already In Preparation and cannot be cancelled.', 400))
  }

  //change status to cancelled
  order.status = 'Cancelled';
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order calcelled successfully!',
    data: order
  });
});

// Complete preparation and update ingredients
exports.completePrep = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find the order by ID
  const order = await Order.findById(id).populate('items.item');

  if (!order) {
    return next(new CustomError('Order not found!', 404));
  }
  if (order.status === 'Pending' ){
    return next(new CustomError('Order is not yet Approved.', 400))
  }
  if (order.status === 'Ready'){
    return next(new CustomError('Order is already Prepared.', 400))
  }

  // Update the order status to 'Ready'
  order.status = 'Ready';
  await order.save();

  // Function to deduct ingredient quantities
  const deductIngredients = async (item) => {
    if (item.itemType === 'Food') {
      const food = await Food.findById(item.item);
      if (food) {
        for (const ingredient of food.ingredients) {
          const ingredientRecord = await Ingredient.findById(ingredient.ingredient);
          if (ingredientRecord) {
            ingredientRecord.amount -= ingredient.quantity * item.quantity;
            await ingredientRecord.save();
          }
        }
      }
    } else if (item.itemType === 'SpecialFood') {
      const specialFood = await SpecialFood.findById(item.item);
      if (specialFood) {
        for (const ingredient of specialFood.ingredients) {
          const ingredientRecord = await Ingredient.findById(ingredient.ingredient);
          if (ingredientRecord) {
            ingredientRecord.amount -= ingredient.quantity * item.quantity;
            await ingredientRecord.save();
          }
        }
      }
    }
  };
  // Deduct ingredients for each item in the order
  for (const item of order.items) {
    await deductIngredients(item);
  }

  res.status(200).json({
    status: 'success',
    message: 'Order preparation completed and ingredients updated',
    data: order
  });
});

exports.completePayment = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find the order by ID
  const order = await Order.findById(id).populate('items.item');

  if (!order) {
    return next(new CustomError('Order not found!', 404));
  }
  if (order.status === 'Cancelled'){
    return next(new CustomError('Payment cannot be completed. Order is already cancelled ', 400))
  }
  if (order.status === 'Completed'){
    return next(new CustomError('Order is payment is already completed!', 400))
  }

  // Update the order status to 'Ready'
  order.status = 'Completed';
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order payment completed successfully!',
    data: order
  });
});

exports.confirmOrder= asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find the order by ID
  const order = await Order.findById(id).populate('items.item');

  if (!order) {
    return next(new CustomError('Order not found!', 404));
  }
  if (order.status === 'Ready'){
    return next(new CustomError('Order is already Prepared.', 400))
  }

  // Update the order status to 'Ready'
  order.status = 'In Preparation';
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order confirmed and in preparation',
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
        message: `Successfully deleted order with id: ${id}`,
        data: null
    });
});