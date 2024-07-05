import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import IngredientListPage from './pages/IngredientListPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import OrderEntryPage from './pages/OrderEntryPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import EditOrderPage from './pages/EditOrderPage';
import FoodListPage from './pages/FoodListPage';
import FoodItemDetailsPage from './pages/FoodItemDetailsPage';

import { AuthProvider, AuthContext } from './context/AuthContext';

function App() {
  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AuthContext.Consumer>
            {({ user }) => (
              <>
                <Header role={user ? user.role : ''} />
                <h1 className='app-heading'>Restaurant POS</h1>
                <div className="App-content">
                  <Routes>
                    <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/ingredientlist" element={<IngredientListPage />} />
                    <Route path="/order" element={<OrderEntryPage />} />
                    <Route path="/orders" element={<OrderListPage />} />
                    <Route path="/order/:orderId"element={<OrderDetailPage />} />
                    <Route path='/editOrder/:orderId' element={<EditOrderPage />} />
                    <Route path="/food-menu" element={<FoodListPage />} />
                    <Route path="/food/:foodId" element={<FoodItemDetailsPage />} />
                  </Routes>
                </div>
              </>
            )}
          </AuthContext.Consumer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
