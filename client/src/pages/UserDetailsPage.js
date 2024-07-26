import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';

const UserDetailsPage = () => {
  const { id } = useParams();
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
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(`/user/${id}`);
        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error.response?.data?.message || 'Failed to fetch user details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

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
      const response = await api.patch(`/user/${id}`, userData);
      setUserData(response.data.data);
      navigate('/user'); // Redirect after successful update
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.message || 'Failed to update user details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-details-page">
      <h2>User Details</h2>
  
      {isLoading && <p>Loading user details...</p>}
  
      {error && (
        <p style={{ color: 'red' }}>Error: {error}</p>
      )}
  
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="idNumber">ID Number:</label>
          <input type="text" id="idNumber" name="idNumber" value={userData.idNumber} disabled />
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
          <label htmlFor="role">Current Role:{userData.role}</label>
          <label htmlFor="role">Role:</label>
          <select id="role" name="role" value={userData.role} onChange={handleInputChange} required>
            <option value="">Select Role</option>
            {roles.map((role) => (
                <option key={role._id} value={role.name}>  {/* Set value to role.name */}
                {role.name}
                </option>
            ))}
          </select>
        </div>
        <Button type="submit" label="Save Changes" disabled={isLoading} />
      </form>
    </div>
  );
};

export default UserDetailsPage;
