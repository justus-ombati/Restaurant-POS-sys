import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import Modal from '../components/Modal';

const IngredientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ingredient, setIngredient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [pricePerUnit, setPricePerUnit] = useState(0);

  useEffect(() => {
    const fetchIngredient = async () => {
      setError(null);

      try {
        const response = await api.get(`/ingredient/${id}`);
        setIngredient(response.data.data);

        setName(response.data.data.name);
        setCategory(response.data.data.category);
        setAmount(response.data.data.amount);
        setPricePerUnit(response.data.data.pricePerUnit);
      } catch (error) {
        console.error('Error fetching ingredient:', error);
        setError(error.message || 'Failed to fetch ingredient');
        setIsModalOpen(true);
    };
  }
    fetchIngredient();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'amount':
        setAmount(Number(value));
        break;
      case 'pricePerUnit':
        setPricePerUnit(Number(value));
        break;
      default:
        break;
    }
  };

  const calculateTotalValue = () => {
    return (amount * pricePerUnit).toFixed(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const updatedIngredient = {
        name,
        category,
        amount,
        pricePerUnit
      };
      const response = await api.patch(`/ingredient/${id}`, updatedIngredient);
      setSuccess('Ingredient details updated successfully!');
      setIsModalOpen(true);
      setIngredient(response.data.data);
    } catch (error) {
      console.error('Error updating ingredient:', error);
      setError(error.message || 'Failed to update ingredient');
      setIsModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      try {
        await api.delete(`/ingredient/${id}`);
        navigate('/ingredient');
      } catch (error) {
        console.error('Error deleting ingredient:', error);
        setError(error.response?.data?.message || 'Failed to delete ingredient');
        setIsModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  return (
    <div className="ingredient-details-page">
      <h2>Ingredient Details</h2>
      {/* {isLoading && <p>Loading ingredient details...</p>} */}
  
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
  
      {ingredient && (
        <form>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
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
              value={category}
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
              value={amount}
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
              value={pricePerUnit}
              onChange={handleInputChange}
              min={0}
              required
            />
          </div>
          <div className="form-group">
            <label>Total Stock Value (Ksh):</label>
            <span>{calculateTotalValue()}</span>
          </div>
          <div className="button-group">
            <Button type="save" label="Save Changes" onClick={handleSubmit} />
            <Button type="danger" label="Delete" onClick={handleDelete} />
          </div>
        </form>
      )}
    </div>
  );
};

export default IngredientDetailsPage;
