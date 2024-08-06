import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Modal from '../components/Modal';
import '../styles/loginPage.css';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const [idNumber, setIdNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const credentials = { idNumber, pin };
      const { user } = await login(credentials);
      navigate('/inventory');
      setSuccess('Logged in successfully');
      setIsModalOpen(true);
    } catch (error) {
      console.error('Login page error:', error);
      setError(error.message);
      setIsModalOpen(true);
    }
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
      {success && <Modal type='success' title='Success' message={success} isOpen={isModalOpen} />}
      {error && <Modal type="error" title="Login Error" message={error} isOpen={isModalOpen} />}
    </div>
  );
}

export default LoginPage;
