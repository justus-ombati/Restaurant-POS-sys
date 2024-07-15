import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
const WaitstaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dailyCompletedOrders, setDailyCompletedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get('http://localhost:5000/order', {
          params: statusFilter === 'All' ? {} : { status: statusFilter },
          headers,
        });
        console.log('Orders Response:', response.data);

        // Handle empty orders case
        if (response.data.totalOrders === 0) {
          return <div>No orders to show</div>;
        }

        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Handle errors (consider setting an error state or displaying an error message)
      }
    };

    fetchOrders();
  }, [token, statusFilter]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setDailyCompletedOrders(orders.filter((order) => order.status === 'Completed' && order.updatedAt.slice(0, 10) === today));
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'All') return true;
    return order.status === statusFilter;
  });

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  return (
    <div className="waitstaff-dashboard">
      <h2>Order Management</h2>
      <button onClick={() => navigate('/order')}>Create Order</button>
      <select id="statusFilter" value={statusFilter} onChange={handleStatusChange}>
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="In Preparation">In Preparation</option>
        <option value="Ready">Ready</option>
        <option value="Completed">Completed</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Table No</th>
            <th>Status</th>
            <th>Time Created</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.tableNumber}</td>
              <td>{order.status}</td>
              <td>{order.createdAt.slice(11, 16)}</td>  {/* Extract time from createdAt */}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Daily Summary</h2>
      <p>No. of Orders: {dailyCompletedOrders.length}</p>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total Amount</th>
            <th>Time Prepared (Updated At)</th>
          </tr>
        </thead>
        <tbody>
          {dailyCompletedOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.totalAmount}</td>
              <td>{order.updatedAt.slice(11, 16)}</td>  {/* Extract time from updatedAt */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WaitstaffDashboard;
