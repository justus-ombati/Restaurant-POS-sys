import React, { useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import Button from '../components/Button';

const AddNewIngredientPage = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear any previous errors

    try {
      const response = await api.post('/ingredient', {
        name,
        category,
        amount,
        pricePerUnit
      });

      setSuccess('Ingredient added successfully!');
      clearForm(); // Clear form data after successful submission
    } catch (error) {
      console.error('Error adding ingredient:', error);
      setError(error.response?.data?.message || 'Failed to add ingredient');
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setName('');
    setCategory('');
    setAmount(0);
    setPricePerUnit(0);
  };

  return (
    <div className="add-new-ingredient">
      <h2>Add New Ingredient</h2>
      {error && (
        <Modal type="error" title="Error" message={error} isOpen={!!error} onClose={() => setError(null)}>
          <Button type="text" label="Close" onClick={() => setError(null)} />
        </Modal>
      )}
      {success && (
        <Modal type="success" title="Success" message={success} isOpen={!!success} onClose={() => setSuccess(null)}>
          <Button type="text" label="Close" onClick={() => setSuccess(null)} />
        </Modal>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Quantity (KG/L):</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={0} required />
        </div>
        <div className="form-group">
          <label htmlFor="pricePerUnit">Price per Unit (Ksh):</label>
          <input type="number" id="pricePerUnit" value={pricePerUnit} onChange={(e) => setPricePerUnit(Number(e.target.value))} min={0} required />
        </div>
        <Button type="primary" label="Save" disabled={isLoading} />
      </form>
    </div>
  );
};

export default AddNewIngredientPage;