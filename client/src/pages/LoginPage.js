import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Modal from '../components/Modal';
import '../styles/loginPage.css';

function LoginPage({ onLogin }) {
  const [idNumber, setIdNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State for modal message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idNumber, pin }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token and user information in local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Update the user in the app state
        onLogin(data.user);

        // Handle successful login
        console.log('Login successful', data);
        navigate('/ingredientlist'); // Redirect to the ingredient list page
      } else {
        // Handle error response
        setModalMessage(data.message || 'Login failed');
        setIsModalOpen(true); // Open the modal
      }
    } catch (error) {
      setModalMessage('An error occurred while logging in');
      setIsModalOpen(true); // Open the modal
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
        <Button type="submit" label="Login" onClick={handleSubmit} />
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
