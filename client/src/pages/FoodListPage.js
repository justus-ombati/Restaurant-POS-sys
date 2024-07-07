import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../styles/foodListPage.css';

const FoodListPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [specialFoods, setSpecialFoods] = useState([]);
  const [activeTab, setActiveTab] = useState('special');

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
          axios.get('http://localhost:5000/food/'),
          axios.get('http://localhost:5000/specialFood/'),
        ]);
        console.log('Regular Foods:', foodsRes.data.data);
        console.log('Special Foods:', specialFoodsRes.data.data);
        setFoods(foodsRes.data.data);
        setSpecialFoods(specialFoodsRes.data.data);
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

  const handleViewItem = (foodId) => {
    navigate(`/food/${foodId}`);
  };

  return (
    <div className="food-item-list-page">
      <h1>Food Items</h1>
      <Button type='add' label="Add New" onClick={() => navigate('/food/add-new-food')} style={{ float: 'right' }} />
      <div className="tabs">
        <button
          className={activeTab === 'special' ? 'active' : ''}
          onClick={() => setActiveTab('special')}
        >
          Special Foods
        </button>
        <button
          className={activeTab === 'regular' ? 'active' : ''}
          onClick={() => setActiveTab('regular')}
        >
          Regular Foods
        </button>
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
