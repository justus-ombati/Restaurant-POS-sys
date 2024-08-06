import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import Modal from '../components/Modal';

const UserListPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get('/user');
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.response?.data?.message || 'Failed to fetch users');
        setIsModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list-page">
      <h2>Users</h2>

      {isLoading && <p>Loading users...</p>}

      {success && <Modal type='success' title='Success' message={success} isOpen={isModalOpen}/>}
      {error && <Modal type="error" title="Error" message={error} isOpen={isModalOpen}/>}

      <Button type="primary" label="Add New" onClick={() => navigate('/user/create-user')}/>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.idNumber}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                <Button type='view' label='View' onClick={() => navigate(`/user/${user._id}`)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListPage;