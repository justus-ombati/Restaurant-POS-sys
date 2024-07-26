import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';

const CreateUserPage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    idNumber: '',
    name: '',
    pin: '',
    role: '',
  });
  const [roles, setRoles] = useState([]); // List of available roles
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/role');
        setRoles(response.data.data); // Assuming data.data contains role objects
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/user/register', userData);
      navigate('/users'); // Redirect after successful creation
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.response?.data?.message || 'Failed to create new user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-user-page">
      <h2>Create New User</h2>

      {isLoading && <p>Creating user...</p>}

      {error && (
        <p style={{ color: 'red' }}>Error: {error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="idNumber">ID Number:</label>
          <input type="text" id="idNumber" name="idNumber" value={userData.idNumber} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={userData.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="pin">Pin:</label>
          <input type="password" id="pin" name="pin" value={userData.pin} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select id="role" name="role" value={userData.role} onChange={handleInputChange} required>
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" label="Create User" disabled={isLoading} />
      </form>
    </div>
  );
};

export default CreateUserPage;
