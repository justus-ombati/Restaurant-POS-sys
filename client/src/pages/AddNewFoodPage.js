import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import api from '../api';

const AddNewFoodPage = () => {
  const [foodItem, setFoodItem] = useState({
    name: '',
    type: 'regular',
    ingredients: [],
    cost: 0,
    sellingPrice: 0,
    origin: '',
    description: '',
    steps: ['']
  });
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [error, setError] = useState('');
  const [ success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await api.get('/ingredient');
        setAvailableIngredients(response.data.data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        setError(error.message)
        setIsModalOpen(true);
      }
    };

    fetchIngredients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...foodItem.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setFoodItem((prev) => ({ ...prev, ingredients: updatedIngredients }));
  };

  const handleToggleIngredient = (ingredientId) => {
    const existingIndex = foodItem.ingredients.findIndex(
      (ingredient) => ingredient.ingredient === ingredientId
    );

    if (existingIndex !== -1) {
      const updatedIngredients = foodItem.ingredients.filter((ingredient) => ingredient.ingredient !== ingredientId);
      setFoodItem((prev) => ({ ...prev, ingredients: updatedIngredients }));
    } else {
      const selectedIngredient = availableIngredients.find(
        (ingredient) => ingredient._id === ingredientId
      );
      setFoodItem((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, { ingredient: selectedIngredient._id, quantity: 1, pricePerUnit: selectedIngredient.pricePerUnit }]
      }));
    }
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...foodItem.steps];
    updatedSteps[index] = value;
    setFoodItem((prev) => ({ ...prev, steps: updatedSteps }));
  };

  const handleAddStep = () => {
    setFoodItem((prev) => ({ ...prev, steps: [...prev.steps, ''] }));
  };

  const handleRemoveStep = (index) => {
    const updatedSteps = foodItem.steps.filter((_, i) => i !== index);
    setFoodItem((prev) => ({ ...prev, steps: updatedSteps }));
  };

  const calculateCost = () => {
    return foodItem.ingredients.reduce((total, ingredient) => {
      return total + ingredient.quantity * ingredient.pricePerUnit;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = foodItem.type === 'special' ? '/specialFood' : '/food';
    const payload = {
      name: foodItem.name,
      type: foodItem.type,
      ingredients: foodItem.ingredients,
      cost: calculateCost(),
      sellingPrice: foodItem.sellingPrice,
      ...(foodItem.type === 'special' && { origin: foodItem.origin, description: foodItem.description, steps: foodItem.steps })
    };

    try {
      const response = await api.post(endpoint, payload);
      setFoodItem({
        name: '',
        type: 'regular',
        ingredients: [],
        cost: 0,
        sellingPrice: 0,
        origin: '',
        description: '',
        steps: ['']
      });
      setSuccess('Menu item added successfully!');
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error creating food item:', error);
      setError(error.message);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  return (
    <div className="add-new-food-page">
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
      <h1>Add New Food Item</h1>
      <form onSubmit={handleSubmit}>
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
          <select
            id="type"
            name="type"
            value={foodItem.type}
            onChange={handleInputChange}
            required
          >
            <option value="regular">Regular</option>
            <option value="special">Special</option>
          </select>
        </div>
        {foodItem.type === 'special' && (
          <>
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
          </>
        )}
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
              {foodItem.ingredients.map((ingredient, index) => (
                <tr key={index}>
                  <td>{availableIngredients.find((i) => i._id === ingredient.ingredient)?.name}</td>
                  <td>
                    <input
                      type="number"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', Number(e.target.value))}
                      required
                    />
                  </td>
                  <td>{ingredient.pricePerUnit}</td>
                  <td>
                    <Button type="remove" label="Remove" onClick={handleToggleIngredient(ingredient.ingredient)} />
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
                      checked={foodItem.ingredients.some((i) => i.ingredient === ingredient._id)}
                      onChange={() => handleToggleIngredient(ingredient._id)}
                    />
                    {ingredient.name} - ${ingredient.pricePerUnit.toFixed(2)}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="cost">Cost:</label>
          <span>${calculateCost().toFixed(2)}</span>
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
        {foodItem.type === 'special' && (
          <div className="steps-section">
            <h3>Preparation Steps</h3>
            <ul>
              {foodItem.steps.map((step, index) => (
                <li key={index}>
                  <textarea
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    required
                  />
                  <Button type="remove" label="Remove" onClick={handleRemoveStep(index)} />
                </li>
              ))}
            </ul>
            <Button type="add" label="Add Step" onClick={handleAddStep} />
          </div>
        )}
        <Button type="save" label="Save" onClick={handleSubmit} />
      </form>
    </div>
  );
};

export default AddNewFoodPage;
