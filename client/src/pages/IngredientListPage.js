import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';

const IngredientListPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get('/ingredient/');
        setIngredients(response.data.data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        setError(error.response?.data?.message || 'Failed to fetch ingredients');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  return (
    <div className="ingredient-list-page">
      <h2>Ingredient List</h2>
      <Link to="/ingredient/add-new-ingredient" className="add-new-button">
        <Button type="primary" label="Add New" />
      </Link>

      {isLoading && <p>Loading ingredients...</p>}

      {error && <p className="error-message">{error}</p>}

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
                  <Link to={`/ingredient/${ingredient._id}`}>
                    <Button type="text" label="View" />
                  </Link>
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