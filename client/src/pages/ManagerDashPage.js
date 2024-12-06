import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesGraph from '../components/SalesGraph'; // Replace with your SalesGraph component path
import Headline from '../components/Headline'; // Replace with your Headline component path
import api from '../api';
import Modal from '../components/Modal';
import Button from '../components/Button';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setError(error.message || 'Error fetching inventory data');
        setIsModalOpen(true);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await api.get('/order');
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders data:', error);
        setError(error.message || 'Error fetching orders data');
        setIsModalOpen(true);
      }
    };

    fetchInventoryData();
    fetchOrders();
  }, []);

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  return (
    <div className="manager-dashboard">
      {isModalOpen && success && (
        <Modal
          type='success'
          title='Success'
          message={success}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
      {isModalOpen && error && (
        <Modal
          type="error"
          title="Error"
          message={error}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
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
      <button onClick={() => navigate('/inventory')}>Manage Inventory</button>

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