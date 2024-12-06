import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import Modal from '../components/Modal';

const CreateUserPage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    idNumber: '',
    name: '',
    pin: '',
    role: '',
  });
  const [roles, setRoles] = useState([]); // List of available roles
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/role');
        setRoles(response.data.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError(error.message);
        setIsModalOpen(true);
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
    try {
      const response = await api.post('/user/register', userData);
      setSuccess(response.data.message || "User created successfully");
      setIsModalOpen(true);
      navigate('/users');
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message || 'Failed to create new user');
    }
  };

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  return (
    <div className="create-user-page">
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
      
      <h2>Create New User</h2>
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
        <Button type="submit" label="Create User" onClick={handleSubmit}/>
      </form>
    </div>
  );
};

export default CreateUserPage;
