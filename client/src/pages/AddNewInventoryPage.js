import React, { useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import Button from '../components/Button';

const AddNewIngredientPage = () => {
  const [inventoryItem, setInventoryItem] = useState({
    name: '',
    category: '',
    amount: 0,
    pricePerUnit: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/ingredient', inventoryItem);
      setSuccess('Ingredient added successfully!');
      setIsModalOpen(true);
      setInventoryItem({
        name: '',
        category: '',
        amount: 0,
        pricePerUnit: 0
      });
    } catch (error) {
      console.error('Error adding ingredient:', error);
      setError(error.response?.data?.message);
      setIsModalOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInventoryItem((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  return (
    <div className="add-new-ingredient">
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
      <h2>Add New Ingredient</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={inventoryItem.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={inventoryItem.category}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Quantity (KG/L):</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={inventoryItem.amount}
            onChange={handleInputChange}
            min={0}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pricePerUnit">Price per Unit (Ksh):</label>
          <input
            type="number"
            id="pricePerUnit"
            name="pricePerUnit"
            value={inventoryItem.pricePerUnit}
            onChange={handleInputChange}
            min={0}
            required
          />
        </div>
        <Button type="submit" label="Save" />
      </form>
    </div>
  );
};

export default AddNewIngredientPage;
