import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ role }) => {
  return (
    <header className="header">
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          {role === 'admin' && (
            <>
              <li><Link to="/management">Management</Link></li>
              <li><Link to="/reports">Reports</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
