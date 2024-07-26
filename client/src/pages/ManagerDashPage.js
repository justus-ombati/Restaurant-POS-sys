import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesGraph from '../components/SalesGraph'; // Replace with your SalesGraph component path
import Headline from '../components/Headline'; // Replace with your Headline component path
import api from '../api';

const ManagerDashboard = () => {
  console.log('API:',api.baseURL)
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [orders, setOrders] = useState([]);

  const getStockStatus = (quantity) => {
    if (!inventoryData) return 'Data Unavailable'; // Return a message if no data

    if (quantity === 0) return 'Out of stock';
    if (quantity <= 4) return 'Critically Low';
    if (quantity <= 8) return 'Running Low';
    return 'In plenty';
  };

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await api.get('/ingredient');
        setInventoryData(response.data.data.slice(0, 5)); // Show only top 5 items
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await api.get('/order');
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders data:', error);
      }
    };

    fetchInventoryData();
    fetchOrders();
  }, []);

  return (
    <div className="manager-dashboard">
      <h2>Sales And Profit Analysis</h2>
      <Headline />

      <h2>Sales & Profits Trends</h2>
      <SalesGraph />

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
              <td>{getStockStatus(item.amount)}</td>
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
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerDashboard;