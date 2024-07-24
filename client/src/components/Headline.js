import React, { useState, useEffect } from 'react';
import api from '../api';

const Headline = () => {
  const [totalSales, setTotalSales] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today
  const [salesData, setSalesData] = useState([]); // State for overall sales data

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const calcTotalSalesProfit = () => {
    const totsales = salesData.reduce((total, sale) => total + sale.totalAmount, 0);
    const totprofit = salesData.reduce((total, sale) => total + sale.profit, 0);
    setTotalSales(totsales);
    setTotalProfit(totprofit);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: salesResponse } = await api.get(`http://localhost:5000/sales/getAllSales?date=${selectedDate}`);
        setSalesData(salesResponse || []);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    calcTotalSalesProfit();
  }, [salesData]);

  return (
    <div className="headline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="date-picker-container">
        <label htmlFor="date">Select Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      <p>Total Sales: {totalSales}</p>
      <p>Total Profits: {totalProfit}</p>
    </div>
  );
};

export default Headline;
