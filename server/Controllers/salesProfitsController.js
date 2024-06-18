const express = require('express');
const Sales = require('../Models/salesModel'); // Assuming your sales model is in this path
const asyncErrorHandler = require('../Controllers/errorController');
const router = express.Router();

// Utility function to get daily sales and profits
const getDaySalesAndProfits = asyncErrorHandler(async (selectedDate) => {
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(7, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(21, 0, 0, 0);

  const hourlySalesAndProfits = await Sales.aggregate([
    {
      $match: {
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }
    },
    {
      $group: {
        _id: { $hour: "$date" },
        totalSales: { $sum: "$totalAmount" },
        totalProfit: { $sum: "$profit" }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  return hourlySalesAndProfits;
});

// Utility function to get weekly sales and profits
const getWeekSalesAndProfits = asyncErrorHandler(async (startOfWeek) => {
  const startDate = new Date(startOfWeek);
  const endDate = new Date(startOfWeek);
  endDate.setDate(startDate.getDate() + 6); // end of week
  
  const weeklySalesAndProfits = await Sales.aggregate([
    {
      $match: {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: { $dayOfWeek: "$date" },
        totalSales: { $sum: "$totalAmount" },
        totalProfit: { $sum: "$profit" }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  return weeklySalesAndProfits;
});

// Utility function to get monthly sales and profits
const getMonthSalesAndProfits = asyncErrorHandler(async (selectedMonth) => {
  const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
  const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0); // end of month

  const monthlySalesAndProfits = await Sales.aggregate([
    {
      $match: {
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      }
    },
    {
      $group: {
        _id: { $dayOfMonth: "$date" },
        totalSales: { $sum: "$totalAmount" },
        totalProfit: { $sum: "$profit" }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  return monthlySalesAndProfits;
});

// Endpoint to get daily sales data
exports.getdailySalesProfit = asyncErrorHandler(async (req, res) => {
  const { date } = req.query; // expects date in query string, e.g., ?date=2024-06-17
  const selectedDate = new Date(date);
  const data = await getDaySalesAndProfits(selectedDate);
  res.status(200).json(data);
});

// Endpoint to get weekly sales data
exports.getweeklySalesProfit = asyncErrorHandler(async (req, res) => {
  const { startOfWeek } = req.query; // expects startOfWeek in query string, e.g., ?startOfWeek=2024-06-16
  const startDate = new Date(startOfWeek);
  const data = await getWeekSalesAndProfits(startDate);
  res.status(200).json(data);
});

// Endpoint to get monthly sales data
exports.getmonthlySalesProfit = asyncErrorHandler(async (req, res) => {
  const { month } = req.query; // expects month in query string, e.g., ?month=2024-06
  const selectedMonth = new Date(month);
  const data = await getMonthSalesAndProfits(selectedMonth);
  res.status(200).json(data);
});

module.exports = router;
