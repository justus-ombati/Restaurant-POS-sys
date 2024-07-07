import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SpecialFoodDetails from '../components/SpecialFoodDetails';
import RegularFoodDetails from '../components/RegularFoodDetails';
import Modal from '../components/Modal';
import '../styles/foodItemDetailsPage.css';

const FoodItemDetailsPage = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [foodItem, setFoodItem] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        let response;

        // Try to fetch as a regular food item
        try {
          response = await axios.get(`http://localhost:5000/food/${foodId}`);
          console.log(response.data)
        } catch (regularError) {
          // If not found, try to fetch as a special food item
          response = await axios.get(`http://localhost:5000/specialFood/${foodId}`);
        }

        const { data } = response.data;
        setFoodItem(data);
        setIngredients(data.ingredients || []);

        if (data.type === 'special') {
          setSteps(data.steps || []);
        }
      } catch (error) {
        console.error('Error fetching food item:', error);
        setError('Error fetching food item.');
      }
    };

    fetchFoodItem();
  }, [foodId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodItem({ ...foodItem, [name]: value });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', pricePerUnit: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    console.log(ingredients);
    setIngredients(ingredients.filter((ingredient, i) => i !== index));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleRemoveStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const calculateCost = () => {
    if (!ingredients.length) return 0; // Return 0 if no ingredients
  
    return ingredients.reduce((total, ingredient) => {
      return total + ingredient.quantity * ingredient.pricePerUnit;
    }, 0);
  };

  const handleSaveChanges = async () => {
    setError('');

    try {
      const url = foodItem.type === 'special' ? `http://localhost:5000/specialFood/${foodId}` : `http://localhost:5000/food/${foodId}`;
      await axios.patch(
        url,
        {
          ...foodItem,
          ingredients,
          steps: steps,
        }
      );

      setModalMessage('Food item updated successfully!');
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage('An error occurred while updating the food item');
      setIsModalOpen(true);
    }
  };

  const handleDeleteFoodItem = async () => {
    setError('');

    try {
      const url = foodItem.type === 'special' ? `http://localhost:5000/specialFood/${foodId}` : `http://localhost:5000/food/${foodId}`;
      await axios.delete(url);

      navigate('/food-menu');
    } catch (error) {
      setModalMessage('An error occurred while deleting the food item');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  if (!foodItem) return <div>Loading...</div>;

  return (
    <div className="food-item-details-page">
      <h1>Food Item Details</h1>
      {foodItem.type === 'special' ? (
        <SpecialFoodDetails
          foodItem={foodItem}
          ingredients={ingredients}
          steps={steps}
          handleInputChange={handleInputChange}
          handleIngredientChange={handleIngredientChange}
          handleAddIngredient={handleAddIngredient}
          handleRemoveIngredient={handleRemoveIngredient}
          handleStepChange={handleStepChange}
          handleAddStep={handleAddStep}
          handleRemoveStep={handleRemoveStep}
          calculateCost={calculateCost}
          handleSaveChanges={handleSaveChanges}
          handleDeleteFoodItem={handleDeleteFoodItem}
          setIngredients={setIngredients}
        />
      ) : (
        <RegularFoodDetails
          foodItem={foodItem}
          ingredients={ingredients}
          handleInputChange={handleInputChange}
          handleIngredientChange={handleIngredientChange}
          handleAddIngredient={handleAddIngredient}
          handleRemoveIngredient={handleRemoveIngredient}
          calculateCost={calculateCost}
          handleSaveChanges={handleSaveChanges}
          handleDeleteFoodItem={handleDeleteFoodItem}
          setIngredients={setIngredients}
        />
      )}
      <Modal isOpen={isModalOpen} message={modalMessage} onClose={closeModal} />
    </div>
  );
};

export default FoodItemDetailsPage;
