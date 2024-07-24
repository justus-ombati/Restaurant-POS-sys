import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const KitchenStaffDashboard = () => {
    const { user } = useContext(AuthContext);
    const token = user?.token;
    
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dailyReadyOrders, setDailyReadyOrders] = useState([]);
  
  
  useEffect(() => {
    const fetchOrders = async () => {
        try {
            const headers = {};
            if (token) {
            headers.Authorization = `Bearer ${token}`;
            }

        const response = await axios.get('http://localhost:5000/order',{
            params: statusFilter === 'All' ? {} : { status: statusFilter },
            headers
            });
        console.log('Orders Response:', response.data);
        setOrders(response.data.data);

        if (response.data.totalOrders === 0) {
            return <div> no orders to show </div>
        }
        } catch (error) {
        console.error('Error fetching orders:', error);
        // setError('Error fetching orders!');
        }
    };

    fetchOrders();

    }, [ token, statusFilter ]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setDailyReadyOrders(orders.filter((order) => order.status === 'Ready' && order.updatedAt.slice(0, 10) === today));
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'All') return true;
    return order.status === statusFilter;
  });

  const displayedOrders = filteredOrders.slice(0, 5);

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  return (
    <div className="kitchen-dashboard">
      <h2>Order Queue</h2>
      <select id="statusFilter" value={statusFilter} onChange={handleStatusChange}>
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="In Preparation">In Preparation</option>
        <option value="Ready">Ready</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>
                {order.status === 'Pending' && <button>Accept</button>}
                {(order.status === 'In Preparation' || order.status === 'Cancelled') && <button>View</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate('/orders')}>View All</button>

      <h2>Daily Summary</h2>
      <p>No. of Orders: {dailyReadyOrders.length}</p>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total Amount</th>
            <th>Time Prepared</th>
          </tr>
        </thead>
        <tbody>
          {dailyReadyOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.totalAmount}</td>
              <td>{order.updatedAt.slice(11, 16)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KitchenStaffDashboard;
