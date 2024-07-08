import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { AuthContext } from '../context/AuthContext';

const IngredientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [ingredient, setIngredient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [pricePerUnit, setPricePerUnit] = useState(0);

  useEffect(() => {
    const fetchIngredient = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const headers = {};

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get(`http://localhost:5000/ingredient/${id}`, { headers });
        setIngredient(response.data.data);

        setName(response.data.data.name);
        setCategory(response.data.data.category);
        setAmount(response.data.data.amount);
        setPricePerUnit(response.data.data.pricePerUnit);
      } catch (error) {
        console.error('Error fetching ingredient:', error);
        setError(error.response?.data?.message || 'Failed to fetch ingredient');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredient();
  }, [id, token]);

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
    setIsLoading(true);
    setError(null);

    try {
      const updatedIngredient = {
        name,
        category,
        amount,
        pricePerUnit
      };

      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.patch(`http://localhost:5000/ingredient/${id}`, updatedIngredient, { headers });
      setSuccess('Ingredient details updated successfully!');
      setIngredient(response.data.data);
    } catch (error) {
      console.error('Error updating ingredient:', error);
      setError(error.response?.data?.message || 'Failed to update ingredient');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        await axios.delete(`http://localhost:5000/ingredient/${id}`, { headers });
        navigate('/ingredient');
      } catch (error) {
        console.error('Error deleting ingredient:', error);
        setError(error.response?.data?.message || 'Failed to delete ingredient');
      }
    }
  };

  return (
    <div className="ingredient-details-page">
      <h2>Ingredient Details</h2>
  
      {isLoading && <p>Loading ingredient details...</p>}
  
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
  
      {ingredient && (
        <form onSubmit={handleSubmit}>
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
            <Button type="primary" label="Save Changes" disabled={isLoading} />
            <Button type="danger" label="Delete" onClick={handleDelete} />
          </div>
        </form>
      )}
    </div>
  );
};

export default IngredientDetailsPage;
