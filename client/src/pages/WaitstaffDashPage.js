import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Modal from '../components/Modal';

const WaitstaffDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dailyCompletedOrders, setDailyCompletedOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/order', {
          params: statusFilter === 'All' ? {} : { status: statusFilter }
        });
        console.log('Orders Response:', response.data);

        // Handle empty orders case
        if (response.data.totalOrders === 0) {
          return <div>No orders to show</div>;
        }

        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.response?.data?.message || 'Error fetching orders');
        setIsModalOpen(true);      }
    };

    fetchOrders();
  }, [statusFilter]);

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

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };
  
  return (
    <div className="waitstaff-dashboard">
      {success && <Modal type='success' title='Success' message={success} isOpen={isModalOpen}/>}
      {error && <Modal type="error" title="Error" message={error} isOpen={isModalOpen}/>}

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
