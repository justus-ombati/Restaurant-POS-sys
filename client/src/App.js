import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import IngredientListPage from './pages/IngredientListPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import OrderEntryPage from './pages/OrderEntryPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';

function App() {
  const [user, setUser] = useState(null); // Initially, no user is logged in
  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then(response => response.json())
      .then(data => setBackendData(data))
      .catch(error => console.error('Error fetching data:', error));

    // Retrieve the user from local storage on app load
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <Router>
      <div className="App">
        <Header role={user ? user.role : ''} />
        <h1 className='app-heading'>Restaurant POS</h1>
        <div className="App-content">
          <Routes>
            <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/ingredientlist" element={<IngredientListPage />} />
            <Route path="/order" element={<OrderEntryPage />} />
            <Route path="/orders" element={<OrderListPage user= {user} />} />
            <Route path='/order/:orderId' element={<OrderDetailPage user= {user} />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
