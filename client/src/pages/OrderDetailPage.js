import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import '../styles/orderDetailPage.css';

function OrderDetailPage() {
  const { user } = useContext(AuthContext);
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/order/${orderId}`);

        console.log('Order Response:', response.data);
        setOrder(response.data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Unauthorized. Please log in again.');
        setIsModalOpen(true);
      }
    };

    fetchOrder();
  }, [orderId]);

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
    setSuccess(null);
  };

  const handleCancelOrder = async () => {
    try {
      const response = await api.patch(`/order/cancelOrder/${orderId}`);
      console.log('Order cancelled successfully:', response.data);
      setSuccess('Order cancelled successfully!');
      setIsModalOpen(true);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Failed to cancel order. Please try again.');
      setIsModalOpen(true);
    }
  };

  const handleConfirmOrder = async () => {

    try {
      const response = await api.patch(`/order/confirmOrder/${orderId}`);
      console.log('Order Confirmed successfully:', response.data);
      setSuccess('Order Confirmed successfully!');
      setIsModalOpen(true);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error confirming order:', error);
      setError('Failed to confirm order. Please try again.');
      setIsModalOpen(true);
    }
  };

  const handleCompletePrep = async () => {
    try {
      const response = await api.patch(`/order/completePrep/${orderId}`);
      console.log('Preparation completed successfully:', response.data);
      setSuccess('Preparation completed successfully!');
      setIsModalOpen(true);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error completing preparation:', error);
      setError('Failed to complete preparation. Please try again.');
      setIsModalOpen(true);
    }
  };

  const handleCompletePayment = async () => {
    try {
      const response = await api.patch(`/order/completePayment/${orderId}`);
      console.log('Payment completed successfully:', response.data);
      setSuccess('Payment completed successfully!');
      setIsModalOpen(true);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error completing payment:', error);
      setError('Failed to complete payment. Please try again.');
      setIsModalOpen(true);
    }
  };

  if (!order) {
    return <div>Order Unavailable...</div>;
  }

  return (
    <div className="order-detail-page">
      <h1>Order Detail</h1>
      {error && <Modal type='error' title='Error' message={error} isOpen={isModalOpen} onClose={closeModal} />}
      {success && <Modal type='success' title='Success' message={success} isOpen={isModalOpen} onClose={closeModal} />}
      <div className="order-info">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Table No.:</strong> {order.tableNumber}</p>
        <p><strong>Customer Name:</strong> {order.customerName}</p>
        <p><strong>Status:</strong> {order.status}</p>
      </div>
      <div className="order-details">
        <h2>Order Detail</h2>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(({ item, quantity }) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{quantity}</td>
                <td>{item.sellingPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p><strong>Total Amount:</strong> {order.totalAmount}</p>
        <p><strong>Message:</strong> {order.message}</p>
      </div>
      <div className="order-actions">
        {user.role === 'waitstaff' && (order.status === 'Pending' || order.status === 'In Preparation') &&
            <Button type="edit" label="Edit Order" onClick={() => navigate(`/editOrder/${orderId}`)} />
        }
        {user.role === 'kitchen' && order.status === 'Pending' && (
          <>
            <Button type="confirm" label="Confirm Order" onClick={handleConfirmOrder} />
            <Button type="cancel" label="Reject Order" onClick={handleCancelOrder} />                    
          </>
        )}
        {user.role === 'kitchen' && order.status === 'In Preparation' && (
          <>
            <Button type="confirm" label="Complete Preparation" onClick={handleCompletePrep} />
            <Button type="cancel" label="Reject Order" onClick={handleCancelOrder} /> 
          </>
        )}
        {user.role === 'waitstaff' && order.status === 'Ready' && (
          <Button type="complete-payment" label="Complete Payment" onClick={handleCompletePayment} />
        )}
      </div>
    </div>
  );
}

export default OrderDetailPage;
