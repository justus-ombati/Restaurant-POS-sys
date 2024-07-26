import React, { useState, useEffect } from 'react';
import api from '../api';
import Button from './Button';
import '../styles/foodItemDetailsPage.css';

const SpecialFoodDetails = ({
  foodItem,
  ingredients,
  steps,
  handleInputChange,
  handleIngredientChange,
  handleRemoveIngredient,
  handleStepChange,
  handleAddStep,
  handleRemoveStep,
  calculateCost,
  handleSaveChanges,
  handleDeleteFoodItem,
  setIngredients,
}) => {
  const [availableIngredients, setAvailableIngredients] = useState([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await api.get('/ingredient');
        setAvailableIngredients(response.data.data);
        
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchIngredients();
  }, []);

  const handleToggleIngredient = (ingredientId) => {
    const existingIndex = ingredients.findIndex(
      (ingredient) => ingredient.ingredient._id === ingredientId
    );

    if (existingIndex !== -1) {
      // If ingredient exists, remove it
      const updatedIngredients = ingredients.filter((ingredient) => ingredient.ingredient._id !== ingredientId);
      setIngredients(updatedIngredients);
    } else {
      // Otherwise, add it to the list
      const selectedIngredient = availableIngredients.find(
        (ingredient) => ingredient._id === ingredientId
      );
      setIngredients([...ingredients, { ingredient: selectedIngredient, quantity: 1 }]);
    }
  };

  return (
    <div className="special-food-details">
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={foodItem.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="type">Type:</label>
        <input
          type="text"
          id="type"
          name="type"
          value={foodItem.type}
          readOnly
        />
      </div>
      <div className="form-group">
        <label htmlFor="origin">Origin:</label>
        <input
          type="text"
          id="origin"
          name="origin"
          value={foodItem.origin}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={foodItem.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="cost">Cost:</label>
        <span>${foodItem.cost.toFixed(2)}</span>
      </div>
      <div className="form-group">
        <label htmlFor="sellingPrice">Selling Price:</label>
        <input
          type="number"
          id="sellingPrice"
          name="sellingPrice"
          value={foodItem.sellingPrice}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="ingredients-section">
        <h3>Ingredients</h3>
        <table>
          <thead>
            <tr>
              <th>Ingredient Name</th>
              <th>Quantity</th>
              <th>Price Per Unit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={ingredient.ingredient.name || ''} // Display name (assuming it's present)
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={ingredient.quantity || 0} // Display quantity (assuming it's present)
                    onChange={(e) => handleIngredientChange(index, 'quantity', Number(e.target.value))}
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={ingredient.ingredient.pricePerUnit || 0} // Display pricePerUnit (assuming it's present)
                    onChange={(e) => handleIngredientChange(index, 'pricePerUnit', Number(e.target.value))}
                    required
                  />
                </td>
                <td>
                  <Button type="remove" label="Remove" onClick={() => handleRemoveIngredient(index)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="available-ingredients">
          <h3>Add Ingredients</h3>
          <ul>
            {availableIngredients.map((ingredient) => (
              <li key={ingredient._id}>
                <label>
                  <input
                    type="checkbox"
                    checked={ingredients.some(i => i.ingredient._id === ingredient._id)}
                    onChange={() => handleToggleIngredient(ingredient._id)}
                  />
                  {ingredient.name} - ${ingredient.pricePerUnit.toFixed(2)}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="steps-section">
        <h3>Preparation Steps</h3>
        <ul>
          {steps.map((step, index) => (
            <li key={index}>
              <textarea
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                required
              />
              <Button type="remove" label="Remove" onClick={() => handleRemoveStep(index)} />
            </li>
          ))}
        </ul>
        <Button type="add" label="Add Step" onClick={handleAddStep} />
      </div>
      <div className="form-actions">
        <Button type="save" label="Save Changes" onClick={handleSaveChanges} />
        <Button type="delete" label="Delete Food Item" onClick={handleDeleteFoodItem} />
      </div>
    </div>
  );
};

export default SpecialFoodDetails;
