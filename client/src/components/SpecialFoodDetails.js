import React from 'react';

const SpecialFoodDetails = ({
  foodItem,
  ingredients,
  steps,
  handleInputChange,
  handleIngredientChange,
  handleAddIngredient,
  handleRemoveIngredient,
  handleStepChange,
  handleAddStep,
  handleRemoveStep,
  calculateCost,
  handleSaveChanges,
  handleDeleteFoodItem,
}) => {
  return (
    <div>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={foodItem.name} onChange={handleInputChange} />
      </div>
      <div>
        <label>Type:</label>
        <input type="text" name="type" value={foodItem.type} readOnly />
      </div>
      <div>
        <label>Origin:</label>
        <input type="text" name="origin" value={foodItem.origin} onChange={handleInputChange} />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={foodItem.description} onChange={handleInputChange} />
      </div>
      <div>
        <label>Cost:</label>
        <input type="text" value={calculateCost()} readOnly />
      </div>
      <div>
        <label>Selling Price:</label>
        <input type="text" name="sellingPrice" value={foodItem.sellingPrice} onChange={handleInputChange} />
      </div>
      <div>
        <h3>Ingredients</h3>
        <table>
          <thead>
            <tr>
              <th>Ingredient name</th>
              <th>Quantity</th>
              <th>Price per Unit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient, index) => (
              <tr key={index}>
                <td>
                  <input type="text" value={ingredient.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} />
                </td>
                <td>
                  <input type="number" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} />
                </td>
                <td>
                  <input type="number" value={ingredient.pricePerUnit} onChange={(e) => handleIngredientChange(index, 'pricePerUnit', e.target.value)} />
                </td>
                <td>
                  <button onClick={() => handleRemoveIngredient(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddIngredient}>Add Ingredient</button>
      </div>
      <div>
        <h3>Preparation Steps</h3>
        <ul>
          {steps.map((step, index) => (
            <li key={index}>
              <textarea value={step} onChange={(e) => handleStepChange(index, e.target.value)} />
              <button onClick={() => handleRemoveStep(index)}>Remove</button>
            </li>
          ))}
        </ul>
        <button onClick={handleAddStep}>Add Step</button>
      </div>
      <button onClick={handleSaveChanges}>Save Changes</button>
      <button onClick={handleDeleteFoodItem}>Delete Food Item</button>
    </div>
  );
};

export default SpecialFoodDetails;
