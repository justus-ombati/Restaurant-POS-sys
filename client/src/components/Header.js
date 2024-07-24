import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import logo from '../icons/logo.png';
import '../styles/header.css';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <img src={logo} className="logo-icon" alt="logo" />
      <nav>
        <ul>
          {!user && <Button type="view" label="Login" onClick={() => navigate('/')} />}
          {user?.role === 'admin' && (
            <>
              <li><Link to="/admin-dash">Dashboard</Link></li>
              <li><Link to="/users">Users</Link></li>
              <li><Link to="/sales">Sales</Link></li>
              <li><Link to="/roles">Roles</Link></li>
              <Button type="view" label="Logout" onClick={handleLogout} />
            </>
          )}
          {user?.role === 'manager' && (
            <>
              <li><Link to="/manager-dash">Dashboard</Link></li>
              <li><Link to="/sales">Sales</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/ingredients">Inventory</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <Button type="view" label="Logout" onClick={handleLogout} />
            </>
          )}
          {user?.role === 'kitchen' && (
            <>
              <li><Link to="/kitchen-dash">Dashboard</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/ingredients">Inventory</Link></li>
              <Button type="view" label="Logout" onClick={handleLogout} />
            </>
          )}
          {user?.role === 'waitstaff' && (
            <>
              <li><Link to="/waitstaff-dash">Dashboard</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/ingredients">Inventory</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <Button type="view" label="Logout" onClick={handleLogout} />
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
