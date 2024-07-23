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
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const credentials = { idNumber, pin };
      const { user } = await login(credentials);
      onLogin(user); // Pass the user data instead of the credentials
      navigate('/ingredient');
      setSuccess('Loged in successfully')
      openModal();
    } catch (error) {
      console.error('Login page error:', error);
      setError(error.message)
      openModal();
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
    setIsModalClosing(false);
  };
  const closeModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300); 
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
      {success && <Modal type='success' title='Success' message={success} isOpen={isModalOpen} onClose={closeModal} />}
      {error && <Modal type="error" title="Login Error" message={error} isOpen={isModalOpen} onClose={closeModal} />}
    </div>
  );
}

export default LoginPage;
