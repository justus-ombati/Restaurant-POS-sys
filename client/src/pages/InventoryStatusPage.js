import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import Modal from '../components/Modal';

const InventoryStatusPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await api.get('/ingredient');
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

  const calculateTotalValue = () => {
    return ingredients.reduce((total, ingredient) => {
      return total + (ingredient.amount * ingredient.pricePerUnit);
    }, 0).toFixed(2);
  };

  const getLowStockIngredients = () => {
    return ingredients.filter((ingredient) => ingredient.amount <= 8);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'Out of stock';
    if (quantity <= 4) return 'Critically Low';
    if (quantity <= 8) return 'Running Low';
    return 'In plenty';
  };

  return (
    <div className="inventory-status-page">
      <h2>Inventory Status</h2>

      {isLoading && <p>Loading inventory data...</p>}
      {success && <Modal type='success' title='Success' message={success} isOpen={isModalOpen}/>}
      {error && <Modal type="error" title="Error" message={error} isOpen={isModalOpen}/>}

      {/* Inventory overview section */}
      <section>
        <h3>Inventory Overview</h3>
        <p>Total Inventory Value: Ksh {calculateTotalValue()}</p>
      </section>

      {/* Low Stock Alerts section */}
      <section>
        <h3>Low Stock Alerts</h3>
        {getLowStockIngredients().length === 0 ? (
          <p>No ingredients currently have low stock.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Remaining Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {getLowStockIngredients().map((ingredient) => (
                <tr key={ingredient._id}>
                  <td>{ingredient.name}</td>
                  <td>{ingredient.amount}</td>
                  <td>{getStockStatus(ingredient.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Current Inventory Levels */}
      <section>
        <h3>Current Inventory Levels</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr key={ingredient._id}>
                <td>{ingredient.name}</td>
                <td>{ingredient.amount}</td>
                <td>{getStockStatus(ingredient.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default InventoryStatusPage;