import React, { useState, useEffect } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import Modal from '../components/Modal';
import '../styles/editOrderPage.css';

const EditOrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [foods, setFoods] = useState([]);
  const [specialFoods, setSpecialFoods] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/order/${orderId}`);
        const { data } = response.data;
        setOrder(data);
        setTableNumber(data.tableNumber);
        setCustomerName(data.customerName);
        setItems(data.items.map(({ item, quantity, price, itemType }) => ({
          item: item._id,
          name: item.name,
          quantity,
          price: price ?? item.sellingPrice, // Use item price if not already set
          itemType
        })));
        updateTotalAmount(data.items);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error.message);
        setIsModalOpen(true);
      }
    };

    const fetchAvailableItems = async () => {
      try {
        const [foodsRes, specialFoodsRes] = await Promise.all([
          api.get('/food/'),
          api.get('/specialFood/'),
        ]);

        console.log('Foods Response:', foodsRes.data);
        console.log('Special Foods Response:', specialFoodsRes.data);

        setFoods(Array.isArray(foodsRes.data.data) ? foodsRes.data.data : []);
        setSpecialFoods(Array.isArray(specialFoodsRes.data.data) ? specialFoodsRes.data.data : []);
      } catch (error) {
        console.error('Error fetching available items:', error);
        setError(error.message);
        setIsModalOpen(true);
      }
    };

    fetchOrder();
    fetchAvailableItems();
  }, [orderId]);

  const updateTotalAmount = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price ?? item.item.sellingPrice) * item.quantity, 0);
    setTotalAmount(total);
  };

  const handleAddItem = (item) => {
    const existingItem = items.find(i => i.item === item._id);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.price = item.sellingPrice; // Ensure price is set correctly
      setItems([...items]);
    } else {
      setItems([...items, { item: item._id, name: item.name, quantity: 1, price: item.sellingPrice, itemType: item.itemType }]);
    }
    updateTotalAmount([...items, { item: item._id, name: item.name, quantity: 1, price: item.sellingPrice, itemType: item.itemType }]);
  };

  const handleItemChange = (itemType, item, isChecked) => {
    console.log('Item being added:', item);
    if (isChecked) {
      handleAddItem({ ...item, itemType });
    } else {
      handleRemoveItem(item._id);
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = items.filter(item => item.item !== itemId);
    setItems(updatedItems);
    updateTotalAmount(updatedItems);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedItems = items.map(item =>
      item.item === itemId ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);
    updateTotalAmount(updatedItems);
  };

  const handleSubmit = async (e) => {
    // Log items before sending to server for debugging
    console.log('Items being sent:', items);

    try {
      await api.patch(`/order/${orderId}`,
        {
          items: items.map(({ item, quantity, itemType }) => ({
            item,
            quantity,
            itemType
          })),
          customerName,
          tableNumber,
          message,
        }
      );

      setSuccess('Order updated');
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error updating order:', error);
      setError(error.message);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  return (
    <div className="edit-order-page">
      <h1>Edit Order</h1>
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
          title="Login Error"
          message={error}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
      
      {order && <h2>Order ID: {order._id}</h2>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tableNumber">Table Number:</label>
          <input
            type="text"
            id="tableNumber"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="customerName">Customer Name:</label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="items-section">
          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Sub-Total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ item, name, quantity, price, itemType }) => (
                <tr key={item}>
                  <td>{name}</td>
                  <td>
                    <input
                      type="number"
                      value={quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                    />
                  </td>
                  <td>{price}</td>
                  <td>{(price * quantity).toFixed(2)}</td>
                  <td>
                    <Button type="remove" label="Remove" onClick={() => handleRemoveItem(item)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="food-lists">
            <div className="special-foods">
              <h2>Special Foods</h2>
              {specialFoods.map(specialFood => (
                <div key={specialFood._id}>
                  <input
                    type="checkbox"
                    onChange={(e) => handleItemChange('SpecialFood', specialFood, e.target.checked)}
                  />
                  <label>{specialFood.name}</label>
                </div>
              ))}
            </div>
            <div className="regular-foods">
              <h2>Regular Foods</h2>
              {foods.map(food => (
                <div key={food._id}>
                  <input
                    type="checkbox"
                    onChange={(e) => handleItemChange('Food', food, e.target.checked)}
                  />
                  <label>{food.name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Total Amount:</label>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <Button type="save" label="Update Order" onClick={handleSubmit}/>
      </form>
    </div>
  );
};

export default EditOrderPage;
