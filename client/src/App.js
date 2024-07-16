import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './pages/AdminDashPage';
import KitchenStaffDashboard from './pages/KitchenDashboard';
import WaitstaffDashboard from './pages/WaitstaffDashPage';
import ManagerDashboard from './pages/ManagerDashPage';
import IngredientListPage from './pages/IngredientListPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import OrderEntryPage from './pages/OrderEntryPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import EditOrderPage from './pages/EditOrderPage';
import AddNewFoodPage from './pages/AddNewFoodPage'
import FoodListPage from './pages/FoodListPage';
import FoodItemDetailsPage from './pages/FoodItemDetailsPage';
import AddNewIngredientPage from './pages/AddNewIngredientPage';
import IngredientDetailsPage from './pages/IngredientDetailsPage';
import InventoryStatusPage from './pages/InventoryStatusPage';
import UserListPage from './pages/UserListPage';
import CreateUserPage from './pages/CreateUserPage';
import SalesReportPage from './pages/SalesReportPage';
import SaleDetailsPage from './pages/SaleDetailsPage';

import { AuthProvider, AuthContext } from './context/AuthContext';
import UserDetailsPage from './pages/UserDetailsPage';

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
                    <Route path="/adminDash" element={<AdminDashboard />} />
                    <Route path="/kitchenDash" element={<KitchenStaffDashboard />} />
                    <Route path="/waitstaffDash" element={<WaitstaffDashboard />} />
                    <Route path="/managerDash" element={<ManagerDashboard />} />
                    <Route path="/order" element={<OrderEntryPage />} />
                    <Route path="/orders" element={<OrderListPage />} />
                    <Route path="/order/:orderId"element={<OrderDetailPage />} />
                    <Route path='/editOrder/:orderId' element={<EditOrderPage />} />                    
                    <Route path="/food/add-new-food" element={<AddNewFoodPage />} />
                    <Route path="/food-menu" element={<FoodListPage />} />
                    <Route path="/food/:foodId" element={<FoodItemDetailsPage />} />
                    <Route path="/ingredient/add-new-ingredient" element={<AddNewIngredientPage />} />
                    <Route path="/ingredient/" element={<IngredientListPage />} />
                    <Route path="/ingredient/:id" element={<IngredientDetailsPage />} />
                    <Route path="/ingredient/:id" element={<IngredientDetailsPage />} />
                    <Route path="/inventory" element={<InventoryStatusPage />} />
                    <Route path="/users" element={<UserListPage />} />
                    <Route path="/user/:id" element={<UserDetailsPage />} />
                    <Route path="/user/create-user" element={<CreateUserPage />} />
                    <Route path="/sales" element={<SalesReportPage />} />
                    <Route path="/sales/:saleId" element={<SaleDetailsPage />} />

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
