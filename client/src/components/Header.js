import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import logo from '../icons/logo.png';
import '../styles/header.css';

const Header = ({ role }) => {

  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('user');
  navigate('/ingredient');
}
const handleLogin = () => {
  navigate('/');
}

  return (
    <header className="header">
      <img src={logo} className='logo-icon' alt='logo'></img>
      <nav>
        <ul>
          <Button type='view' label='Login' onClick={handleLogin()} />
          {role === 'admin' && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/users">Users</Link></li>
              <li><Link to="/sales">Sales</Link></li>
              <li><Link to="/roles">Roles</Link></li>
              <Button type='view' label='Logout' onClick={handleLogout()} />
            </>
          )}
          {role === 'manager' && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/sales">Sales</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/ingredients">Inventory</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <Button type='view' label='Logout' onClick={handleLogout()} />
            </>
          )}
          {role === 'kitchen' && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/ingredients">Inventory</Link></li>
              <Button type='view' label='Logout' onClick={handleLogout()} />

            </>
          )}
          {role === 'waitstaff' && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/ingredients">Inventory</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <Button type='view' label='Logout' onClick={handleLogout()} />
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
