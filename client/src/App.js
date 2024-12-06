import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashPage';
import KitchenStaffDashboard from './pages/KitchenDashPage';
import WaitstaffDashboard from './pages/WaitstaffDashPage';
import ManagerDashboard from './pages/ManagerDashPage';
import InventoryListPage from './pages/InventoryListPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import OrderEntryPage from './pages/OrderEntryPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import EditOrderPage from './pages/EditOrderPage';
import AddNewFoodPage from './pages/AddNewFoodPage';
import FoodListPage from './pages/FoodListPage';
import FoodItemDetailsPage from './pages/FoodItemDetailsPage';
import AddNewInventoryPage from './pages/AddNewInventoryPage';
import InventoryDetailsPage from './pages/InventoryDetailsPage';
import InventoryStatusPage from './pages/InventoryStatusPage';
import UserListPage from './pages/UserListPage';
import UserDetailsPage from './pages/UserDetailsPage';
import CreateUserPage from './pages/CreateUserPage';
import SalesReportPage from './pages/SalesReportPage';
import SaleDetailsPage from './pages/SaleDetailsPage';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };


return (
  <AuthProvider>
    <Router>
      <div className="App">
        <Header />
        <h1 className='app-heading'>Restaurant POS</h1>
        <div className="App-content">
          <Routes>
            <Route path="/" element={<LoginPage />} />

            {/* Orders Section */}
            <Route path="orders" element={<OrderListPage />} />
            <Route path="order/order-entry" element={<OrderEntryPage />} />
            <Route path="order/:orderId" element={<OrderDetailPage />} />
            <Route path="order/edit-order/:orderId" element={<EditOrderPage />} />

            {/* Menu Section */}
            <Route path="menu" element={<FoodListPage />} />
            <Route path="menu/add-new-item" element={<AddNewFoodPage />} />
            <Route path="menu/:foodId" element={<FoodItemDetailsPage />} />

            {/* Inventory Section */}
            <Route path="inventory" element={<InventoryListPage />} />
            <Route path="inventory/add" element={<AddNewInventoryPage />} />
            <Route path="inventory/:id" element={<InventoryDetailsPage />} />
            <Route path="inventory/inventory-status" element={<InventoryStatusPage />} />

            {/* Users Section */}
            <Route path="users" element={<UserListPage />} />
            <Route path="users/create-user" element={<CreateUserPage />} />
            <Route path="users/:id" element={<UserDetailsPage />} />

            {/* Sales Section */}
            <Route path="sales" element={<SalesReportPage />} />
            <Route path="sales/:saleId" element={<SaleDetailsPage />} />

            {/* Additional Routes */}
            <Route path="/admin-dash" element={<AdminDashboard />} />
            <Route path="/kitchen-dash" element={<KitchenStaffDashboard />} />
            <Route path="/waitstaff-dash" element={<WaitstaffDashboard />} />
            <Route path="/manager-dash" element={<ManagerDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  </AuthProvider>
);
}


export default App;