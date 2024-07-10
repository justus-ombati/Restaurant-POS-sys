import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const SalesReportPage = () => {
    const { user } = useContext(AuthContext);
    const token = user?.token;


  const [filter, setFilter] = useState('daily'); // Default filter
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const headers = {};

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const baseUrl = 'http://localhost:5000/sales/getAllSales';
        // const url = `${baseUrl}/${filter}?date=${selectedDate}`;
        const url = `${baseUrl}/?date=${selectedDate}`;

        const response = await axios.get(url);
        setSalesData(response.data);
        console.log(salesData)
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError(error.response?.data?.message || 'Failed to fetch sales data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); 
    calcTotalSalesProfit()
  }, [filter, selectedDate, salesData, token]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const calcTotalSalesProfit = () => {
    const totalSales =  salesData.reduce((total, sale) => total + sale.totalAmount, 0);
    const totalProfit = salesData.reduce((total, sale) => total + sale.profit, 0);
    setTotalSales(totalSales);
    setTotalProfit(totalProfit);
    console.log(totalSales)
    console.log(totalProfit)
  };

  const calcAvgSales = () => {
    const avgSales = totalSales / salesData.length;
    console.log(avgSales)
    return avgSales;
  }

  const calcAvgProfits = () => {
    const avgProfit = totalProfit / salesData.length;
    console.log(avgProfit)
    return avgProfit;
  }

  const handleViewSale = (saleId) => {
    navigate(`/sales/${saleId}`)
  }

  return (
    <div className="sales-report-page">
      <h2>Sales Report</h2>
      
      <div className="filter-container">
        <label htmlFor="filter">Filter by:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="date-picker-container">
        <label htmlFor="date">Select Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      {isLoading && <p>Fetching sales data...</p>}

      {error && (
        <p style={{ color: 'red' }}>Error: {error}</p>
      )}

      {salesData.length > 0 && (
        <div className="sales-summary">
          <p>Total Sales: {totalSales}</p>
          <p>Total Profits: {totalProfit}</p>
          <p>Number of Transactions: {salesData.length}</p>
          <p>Average order value: {calcAvgSales().toFixed(2)}</p>
          <p>Average profit per order: {calcAvgProfits().toFixed(2)}</p>
        </div>
      )}

      {salesData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Transaction Id</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Amount</th>
              <th>Profit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale._id}>
                <td>{sale._id}</td>
                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                <td>{sale.customer?.name || 'N/A'}</td>  {/* Handle missing customer */}
                <td>{sale.totalAmount}</td>
                <td>{sale.profit}</td>
                <td>
                    <Button type="view" label="View" onClick={() => handleViewSale(sale._id)} />
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

      {salesData.length === 0 && <p>No sales data found for the selected filter and date.</p>}
    </div>
  );
};

export default SalesReportPage;
