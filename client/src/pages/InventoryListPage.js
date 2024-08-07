import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import Modal from '../components/Modal';

const IngredientListPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchIngredients = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await api.get('/ingredient/');
        setIngredients(response.data.data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        setError(error.response?.data?.message || 'Failed to fetch ingredients');
        setIsModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  return (
    <div className="ingredient-list-page">
      <h2>Ingredient List</h2>
        <Button className="add-new-button" type="add" label="Add New" onClick={() =>navigate('/ingredient/add-new-ingredient')}/>

      {isLoading && <p>Loading ingredients...</p>}
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
      
      {ingredients.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity (KG/L)</th>
              <th>Price per Unit (Ksh)</th>
              <th>Total Stock Value (Ksh)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr key={ingredient._id}>
                <td>{ingredient.name}</td>
                <td>{ingredient.amount}</td>
                <td>{ingredient.pricePerUnit}</td>
                <td>{(ingredient.amount * ingredient.pricePerUnit).toFixed(2)}</td>
                <td>
                  <Button type="view" label="View" onClick={() => navigate(`/inventory/${ingredient._id}`)}/>
                  {/* Add Delete Button Logic Here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {ingredients.length === 0 && !isLoading && <p>No ingredients found.</p>}
    </div>
  );
};

export default IngredientListPage;