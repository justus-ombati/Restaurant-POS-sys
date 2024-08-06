import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import '../styles/orderListPage.css';
import { useNavigate, useParams } from 'react-router-dom';

function OrderListPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/order', {
          params: statusFilter === 'All' ? {} : { status: statusFilter }
        });
        console.log('Orders Response:', response.data);
        setOrders(response.data.data);

        if (response.data.totalOrders === 0) {
          return <div> No orders to show!</div>
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders!');
        setIsModalOpen(true);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await api.patch(`/order/cancelOrder/${orderId}`);
      console.log('Order cancelled successfully:', response.data);
      setSuccess('Order cancelled successfully!');
      setOrders(orders.map(order => order._id === orderId ? response.data.data : order));
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Failed to cancel order. Please try again.');
      setIsModalOpen(true);
    }
  };

  const handleCompletePrep = async (orderId) => {
    try {
      const response = await api.patch(`/order/completePrep/${orderId}`);
      console.log('Preparation completed successfully:', response.data);
      setSuccess('Preparation completed successfully!');
      setOrders(orders.map(order => order._id === orderId ? response.data.data : order));
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error completing preparation:', error);
      setError('Failed to complete preparation. Please try again.');
      setIsModalOpen(true);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await api.patch(`/order/confirmOrder/${orderId}`);
      console.log('Order confirmed successfully:', response.data);
      setSuccess('Order confirmed successfully!');
      setOrders(orders.map(order => order._id === orderId ? response.data.data : order));
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error confirming order:', error);
      setError('Failed to confirm order. Please try again.');
      setIsModalOpen(true);
    }
  };

  const handleCompletePayment = async (orderId) => {
    try {
      const response = await api.patch(`/order/completePayment/${orderId}`);
      console.log('Payment completed successfully:', response.data);
      setSuccess('Payment completed successfully!');
      setOrders(orders.map(order => order._id === orderId ? response.data.data : order));
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error completing payment:', error);
      setError('Failed to complete payment. Please try again.');
      setIsModalOpen(true);
    }
  };

  return (
    <div className="order-list-page">
      <h1>Order List</h1>
      {error && <Modal type='error' title='Error' message={error} isOpen={isModalOpen} onClose={closeModal} />}
      {success && <Modal type='success' title='Success' message={success} isOpen={isModalOpen} onClose={closeModal} />}
      <div className="filter">
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select id="statusFilter" value={statusFilter} onChange={handleStatusChange}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Preparation">In Preparation</option>
          <option value="Ready">Ready</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Table No.</th>
            <th>Customer Name</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.tableNumber}</td>
              <td>{order.customerName}</td>
              <td>{order.status}</td>
              <td>{order.totalAmount}</td>
              <td>
                <Button type="view" label="View" onClick={() => handleViewOrder(order._id)} />
                {statusFilter === 'Pending' && user.role === 'waitstaff' && (
                  <Button type="cancel" label="Cancel" onClick={() => handleCancelOrder(order._id)} />
                )}
                {statusFilter === 'Pending' && user.role === 'kitchen' && (
                  <>
                    <Button type="confirm" label="Confirm Order" onClick={() => handleConfirmOrder(order._id)} />
                    <Button type="cancel" label="Reject Order" onClick={() => handleCancelOrder(order._id)} />
                  </>
                )}
                {statusFilter === 'In Preparation' && user.role === 'kitchen' && (
                  <Button type="confirm" label="Complete Prep" onClick={() => handleCompletePrep(order._id)} />
                )}
                {statusFilter === 'Ready' && user.role === 'waitstaff' && (
                  <Button type="confirm" label="Complete Payment" onClick={() => handleCompletePayment(order._id)} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderListPage;
