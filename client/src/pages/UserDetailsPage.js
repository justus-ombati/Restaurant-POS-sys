import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import Modal from '../components/Modal';

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    idNumber: '',
    name: '',
    pin: '',
    role: '',
  });
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/user/${id}`);
        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error.message || 'Failed to fetch user details');
        setIsModalOpen(true);
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
        setError(error.message || 'Error fetching roles');
        setIsModalOpen(true);
      }
    };

    fetchRoles();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.patch(`/user/${id}`, userData);
      setUserData(response.data.data);
      setSuccess(response.data.message || 'User Details updated');
      setIsModalOpen(true);
      navigate('/user');
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message || 'Failed to update user details');
      setIsModalOpen(true)
    }
  };

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };
  return (
    <div className="user-details-page">
      <h2>User Details</h2>
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
        <Button type="save" label="Save Changes" onClick={handleSubmit} />
      </form>
    </div>
  );
};

export default UserDetailsPage;
