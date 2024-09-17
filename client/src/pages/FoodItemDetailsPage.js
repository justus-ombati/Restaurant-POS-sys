import React, { useState, useEffect} from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import SpecialFoodDetails from '../components/SpecialFoodDetails';
import RegularFoodDetails from '../components/RegularFoodDetails';
import Modal from '../components/Modal';
import '../styles/foodItemDetailsPage.css';

const FoodItemDetailsPage = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('')
  const [success, setSuccess] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        let response;
        // Try to fetch as a regular food item
        try {
          response = await api.get(`/food/${foodId}`);
          console.log(response.data)
        } catch (regularError) {
          // If not found, try to fetch as a special food item
          response = await api.get(`/specialFood/${foodId}`);
        }

        const { data } = response.data;
        setFoodItem(data);
        setIngredients(data.ingredients || []);

        if (data.type === 'special') {
          setSteps(data.steps || []);
        }
      } catch (error) {
        console.error('Error fetching food item:', error);
        setError(error.message);
        setIsModalOpen(true);
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
    try {
      const url = foodItem.type === 'special' ? `/specialFood/${foodId}` : `/food/${foodId}`;
      await api.patch(
        url,
        {
          ...foodItem,
          ingredients,
          steps: steps,
        }
      );
      setSuccess('Food item updated successfully!');
      setIsModalOpen(true);
    } catch (error) {
      setError('An error occurred while updating the food item');
      setIsModalOpen(true);
    }
  };

  const handleDeleteFoodItem = async () => {
    try {
      const url = foodItem.type === 'special' ? `/specialFood/${foodId}` : `/food/${foodId}`;
      await api.delete(url);
      setInfo('Menu item deleted');
      setIsModalOpen(true);
      navigate('/food-menu');
    } catch (error) {
      setError(error.message);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  if (!foodItem) return <div>Loading...</div>;

  return (
    <div className="food-item-details-page">
      <h1>Food Item Details</h1>
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
    </div>
  );
};

export default FoodItemDetailsPage;
