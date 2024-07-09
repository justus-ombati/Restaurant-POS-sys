import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const UserListPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const headers = {};

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get('http://localhost:5000/user', { headers });
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.response?.data?.message || 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div className="user-list-page">
      <h2>Users</h2>

      {isLoading && <p>Loading users...</p>}

      {error && (
        <p style={{ color: 'red' }}>Error: {error}</p>
      )}

      <Link to="/user/create-user" style={{ float: 'right' }}>
        <Button type="primary" label="Add New" />
      </Link>

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
                <Link to={`/user/${user._id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListPage;