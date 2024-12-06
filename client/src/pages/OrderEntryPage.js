import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import '../styles/orderEntryPage.css';


function OrderEntryPage() {
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [foods, setFoods] = useState([]);
  const [specialFoods, setSpecialFoods] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFoods = async () => {
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
        console.error('Error fetching foods:', error);
        setError(error.message || 'Error fetching foods');
        setIsModalOpen(true);
      }
    };

    fetchFoods();
  }, []);

  const handleItemChange = (type, item, isChecked) => {
    if (isChecked) {
      setSelectedItems([...selectedItems, { type, item, quantity: 1, price: item.sellingPrice }]);
    } else {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem.item._id !== item._id));
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setSelectedItems(
      selectedItems.map(selectedItem =>
        selectedItem.item._id === itemId ? { ...selectedItem, quantity: newQuantity } : selectedItem
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(selectedItems.filter(selectedItem => selectedItem.item._id !== itemId));
  };

  const calculateSubtotal = (quantity, price) => quantity * price;

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + calculateSubtotal(item.quantity, item.price), 0);
  };

  const handleSubmit = async () => {
    if (!customerName || !tableNumber || selectedItems.length === 0) {
      setError('Please provide items, customer name, and table number for the order!');
      setIsModalOpen(true);
      return;
    }

    const orderData = {
      items: selectedItems.map(item => ({
        itemType: item.type,
        item: item.item._id,
        quantity: item.quantity,
      })),
      customerName,
      tableNumber,
    };

    try {
      const response = await api.post('/order/', orderData);
      console.log('Order created successfully:', response.data);
      setSuccess('Order created successfully!');
      setIsModalOpen(true);
      // Reset state after successful order creation
      setTableNumber('');
      setCustomerName('');
      setSelectedItems([]);
      document.querySelectorAll('input[type=checkbox]').forEach(checkbox => checkbox.checked = false);
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.message || 'Error creating order');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  return (
    <div className="order-entry-page">
      <h1>Order Entry</h1>
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
      <div className="order-form">
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
      </div>
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
      <div className="current-order">
        <h2>Current Order</h2>
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
            {selectedItems.map(({ item, quantity, price }) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                  />
                </td>
                <td>{price}</td>
                <td>{calculateSubtotal(quantity, price)}</td>
                <td>
                  <Button type="remove" label="Remove" onClick={() => handleRemoveItem(item._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="order-total">
          <label>Order Total: {calculateTotal()}</label>
        </div>
        <Button type="confirm" label="Place Order" onClick={handleSubmit} />
      </div>
    </div>
  );
}

export default OrderEntryPage;
