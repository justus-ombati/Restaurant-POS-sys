import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Modal from '../components/Modal';
import '../styles/loginPage.css';
import { AuthContext } from '../context/AuthContext';

function LoginPage({ onLogin }) {
  const [idNumber, setIdNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const credentials = { idNumber, pin };
      const { user } = await login(credentials);
      onLogin(user); // Pass the user data instead of the credentials
      navigate('/ingredientlist');
    } catch (error) {
      console.error('Login page error:', error); // Debugging line
      setModalMessage('An error occurred while logging in');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="idNumber">ID Number:</label>
          <input
            type="text"
            id="idNumber"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pin">PIN:</label>
          <input
            type="password"
            id="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </div>
        <Button type="submit" label="Login" />
      </form>
      <Modal
        type="error"
        title="Login Error"
        message={modalMessage}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default LoginPage;
