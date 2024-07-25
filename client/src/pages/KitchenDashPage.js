import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const KitchenStaffDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dailyReadyOrders, setDailyReadyOrders] = useState([]);
  
  
  useEffect(() => {
    const fetchOrders = async () => {
        try {
        const response = await api.get('/order',{
            params: statusFilter === 'All' ? {} : { status: statusFilter }
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

    }, [ statusFilter ]);

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
