import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Modal from '../components/Modal';
import '../styles/foodListPage.css';

const FoodListPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [specialFoods, setSpecialFoods] = useState([]);
  const [activeTab, setActiveTab] = useState('special');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    if (!user || user.role !== 'manager') {
      navigate('/');
    } else {
      fetchFoods();
    }
  }, [user, navigate]);

  const fetchFoods = async () => {
    try {
        const [foodsRes, specialFoodsRes] = await Promise.all([
          api.get('/food/'),
          api.get('/specialFood/'),
        ]);
        console.log('Regular Foods:', foodsRes.data.data);
        console.log('Special Foods:', specialFoodsRes.data.data);
        setFoods(foodsRes.data.data);
        setSpecialFoods(specialFoodsRes.data.data);
      } catch (error) {
        console.error('Error fetching foods:', error);
        setError(error.message);
        setIsModalOpen(true);
      }
    };

  const handleViewItem = (foodId) => {
    navigate(`/food/${foodId}`);
  };

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };
  
  return (
    <div className="food-item-list-page">
      <h1>Food Items</h1>
      {success && <Modal type='success' title='Success' message={success} isOpen={isModalOpen}/>}
      {error && <Modal type="error" title="Error" message={error} isOpen={isModalOpen}/>}

      <Button type='add' label="Add New" onClick={() => navigate('/food/add-new-food')} style={{ float: 'right' }} />
      <div className="tabs">
        <Button
          className={activeTab === 'special' ? 'active' : ''}
          onClick={() => setActiveTab('special')}
          label='Special Foods'
          type='view'
        />
        <Button
          type='view'
          className={activeTab === 'regular' ? 'active' : ''}
          onClick={() => setActiveTab('regular')}
          label='Regular Foods'
        />
      </div>
      <div className="tab-content">
        {activeTab === 'special' ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Origin</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {specialFoods.map((food) => (
                <tr key={food._id}>
                  <td>{food.name}</td>
                  <td>{food.origin}</td>
                  <td>{food.sellingPrice}</td>
                  <td>
                    <Button
                      type='view' 
                      label="View"
                      onClick={() => handleViewItem(food._id, 'special')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id}>
                  <td>{food.name}</td>
                  <td>{food.sellingPrice}</td>
                  <td>
                    <Button type='view' label="View" onClick={() => handleViewItem(food._id, 'regular')} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FoodListPage;
