const mongoose = require('mongoose');
const Sales = require('../Models/salesModel');
const Order = require('../Models/orderModel');
const Food = require('../Models/foodModel');
const SpecialFood = require('../Models/specialFoodModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const CustomError = require('../Utils/customError');

// Add a new sale
exports.addSale = asyncErrorHandler(async (req, res, next) => {
  const { orderId } = req.body;

  // Validate order ID
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return next(new CustomError('Invalid Order ID', 400));
  }

  // Check if the order already exists in the sales collection
  const existingSale = await Sales.findOne({ orderId });
  if (existingSale) {
    return next(new CustomError('Order already processed', 400));
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new CustomError('Order not found', 404));
  }

  const newSale = new Sales({ orderId, totalAmount });
  await newSale.save();

  res.status(201).json(newSale);
});

// Get all sales data for a specific date
exports.getAllSales = asyncErrorHandler(async (req, res, next) => {
  const { date } = req.query;

  if (!date) {
    return next(new CustomError('Date query parameter is required', 400));
  }

  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    return next(new CustomError('Invalid date format', 400));
  }

  const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

  const sales = await Sales.find({
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  }).sort({ createdAt: -1 });

  if (!sales.length) {
    return next(new CustomError('No sales data found for the selected date', 404));
  }

  res.status(200).json(sales);
});

// Get sale details by sale ID
exports.getSaleById = asyncErrorHandler(async (req, res, next) => {
  const { saleId } = req.params;

  if (!saleId) {
    return next(new CustomError('Sale ID parameter is required', 400));
  }

  const sale = await Sales.findById(saleId)
    .populate({
      path: 'orderId',
      populate: {
        path: 'items', // Assuming order has an items field
        select: 'itemName quantity price'
      }
    });

  if (!sale) {
    return next(new CustomError('Sale not found', 404));
  }

  const order = sale.orderId;
  const customerName = order.customerName; // Assuming the order has a customerName field
  const itemsDetails = [];

  for (const item of order.items) {
    let itemDetails;
    if (item.itemType === 'Food') {
      itemDetails = await Food.findById(item.item).select('name sellingPrice');
    } else if (item.itemType === 'SpecialFood') {
      itemDetails = await SpecialFood.findById(item.item).select('name sellingPrice');
    }

    if (itemDetails) {
      itemsDetails.push({
        ...item.toObject(),
        itemName: itemDetails.name,
        sellingPrice: itemDetails.sellingPrice
      });
    }
  }

  const saleDetails = {
    ...sale.toObject(),
    order: {
      ...order.toObject(),
      customerName,
      items: itemsDetails
    }
  };


  res.status(200).json(saleDetails);
});

// Get daily sales and profit
exports.getdailySalesProfit = asyncErrorHandler(async (req, res, next) => {
  const { date } = req.query;
  if (!date) {
    return next(new CustomError('Date query parameter is required', 400));
  }

  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    return next(new CustomError('Invalid date format', 400));
  }

  const startHour = 6;
  const endHour = 22;
  const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), startHour, 0, 0);
  const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), endHour, 0, 0);

  console.log(`Querying sales from ${startDate} to ${endDate}`);

  const sales = await Sales.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: { $hour: "$createdAt" },
        totalSales: { $sum: "$totalAmount" },
        totalProfit: { $sum: "$profit" }
      }
    },
    {
      $sort: { "_id": 1 }
    }
  ]);

  console.log('Sales found:', sales);

  res.status(200).json(sales);
});

// Get weekly sales and profit
exports.getweeklySalesProfit = asyncErrorHandler(async (req, res, next) => {
  const { date } = req.query;
  if (!date) {
    return next(new CustomError('Date query parameter is required', 400));
  }
  
  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    return next(new CustomError('Invalid date format', 400));
  }
  
  const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 6, 0, 0, 0);
  const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);

  console.log(`Querying weekly sales from ${startDate} to ${endDate}`);

  const sales = await Sales.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        totalSales: { $sum: "$totalAmount" },
        totalProfit: { $sum: "$profit" }
      }
    },
    {
      $sort: { "_id": 1 }
    }
  ]);

  console.log('Weekly sales found:', sales);

  res.status(200).json(sales);
});

// Get monthly sales and profit
exports.getmonthlySalesProfit = asyncErrorHandler(async (req, res, next) => {
  const { date } = req.query;
  if (!date) {
    return next(new CustomError('Date query parameter is required', 400));
  }
  
  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    return next(new CustomError('Invalid date format', 400));
  }
  
  const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 29, 0, 0, 0);
  const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);

  console.log(`Querying monthly sales from ${startDate} to ${endDate}`);

  const sales = await Sales.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { $dayOfMonth: "$createdAt" },
        totalSales: { $sum: "$totalAmount" },
        totalProfit: { $sum: "$profit" }
      }
    },
    {
      $sort: { "_id": 1 }
    }
  ]);

  console.log('Monthly sales found:', sales);

  res.status(200).json(sales);
});

