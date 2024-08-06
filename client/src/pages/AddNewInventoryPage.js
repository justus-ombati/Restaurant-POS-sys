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
      const response = await api.post('/ingredient', {
        name: inventoryItem.name,
        category: inventoryItem.category,
        amount: inventoryItem.amount,
        pricePerUnit: inventoryItem.pricePerUnit
      });
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
      setError(error.message);
      setIsModalOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInventoryItem((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="add-new-ingredient">
      {success && <Modal type='success' title='Success' message={success} isOpen={isModalOpen}/>}
      {error && <Modal type="error" title="Error" message={error} isOpen={isModalOpen}/>}
      <h2>Add New Ingredient</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={inventoryItem.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input type="text" id="category" value={inventoryItem.category} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Quantity (KG/L):</label>
          <input type="number" id="amount" value={inventoryItem.amount} onChange={handleInputChange} min={0} required />
        </div>
        <div className="form-group">
          <label htmlFor="pricePerUnit">Price per Unit (Ksh):</label>
          <input type="number" id="pricePerUnit" value={inventoryItem.pricePerUnit} onChange={handleInputChange} min={0} required />
        </div>
        <Button type="save" label="Save" onClick={handleSubmit} />
      </form>
    </div>
  );
};

export default AddNewIngredientPage;