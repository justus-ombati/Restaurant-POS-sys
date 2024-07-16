import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SalesGraph from '../components/SalesGraph'; // Replace with your SalesChart component path

const ManagerDashboard = () => {
    const { user } = useContext(AuthContext);
    const token = user?.token;

  const navigate = useNavigate();
  const [totalSales, setTotalSales] = useState(null)
  const [totalProfit, setTotalProfit] = useState(null)
  const [salesData, setSalesData] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const setHeaders = () => {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  useEffect(() => {

    const fetchSalesData = async () => {
        try {
          const headers = setHeaders();
          const response = await axios.get(`http://localhost:5000/sales/getAllSales?date=${selectedDate}`, {headers});
          setSalesData(response.data);
          console.log(salesData)
          calcTotalSalesProfit(salesData); // Calculate totals on data update
        } catch (error) {
          console.error('Error fetching sales data:', error);
          // Handle errors (consider setting an error state or displaying an error message)
        }
      };
  
      fetchSalesData();
    }, [token, selectedDate]);

    const fetchInventoryData = async () => {
      try {
        const headers = setHeaders();
        const response = await axios.get('http://localhost:5000/ingredient', {headers}); // Replace with your inventory endpoint
        setInventoryData(response.data.data.slice(0, 5)); // Show only top 5 items
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        // Handle errors
      }
    };

    const fetchOrders = async () => {
      try {
        const headers = setHeaders();
        const response = await axios.get('http://localhost:5000/order', {headers}); // Replace with your orders endpoint
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders data:', error);
        // Handle errors
      }
    };

    useEffect(() => {
        fetchInventoryData();
        fetchOrders();
      }, [token]);

    const calcTotalSalesProfit = (data) => {
    if (!data) return; // Handle empty data case

    const totalSales = data.reduce((total, sale) => total + sale.totalAmount, 0);
    const totalProfit = data.reduce((total, sale) => total + sale.profit, 0);
    setTotalSales(totalSales);
    setTotalProfit(totalProfit);
    };

    const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    };

    console.log(salesData)


  return (
    <div className="manager-dashboard">
      <h2>Sales And Profit Analysis</h2>
      <div className="date-picker-container">
        <label htmlFor="date">Select Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
        </div>
      {salesData ? (
        <>
          <p>Total Sales: {totalSales}</p>
          <p>Total Profit: {totalProfit}</p>
          <button onClick={() => navigate('/sales')}>Sales Details</button>
        </>
      ) : (
        <p>Loading sales data...</p>
      )}

      <h2>Sales & Profits Trends</h2>
      <SalesGraph/>

      <h2>Inventory Management</h2>
      <table>
        <thead>
          <tr>
            <th>Ingredient ID</th>
            <th>Ingredient Name</th>
            <th>Quantity</th>
            <th>Price Per Unit</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.amount}</td>
              <td>{item.pricePerUnit}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate('/ingredient')}>Manage Inventory</button>

      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Table</th>
            <th>Time Created</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.tableNumber}</td>
              <td>{order.createdAt.slice(0, 16)}</td> {/* Show full date and time */}
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerDashboard;
