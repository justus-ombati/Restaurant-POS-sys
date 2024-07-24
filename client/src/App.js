import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashPage';
import KitchenStaffDashboard from './pages/KitchenDashPage';
import WaitstaffDashboard from './pages/WaitstaffDashPage';
import ManagerDashboard from './pages/ManagerDashPage';
import IngredientListPage from './pages/IngredientListPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import OrderEntryPage from './pages/OrderEntryPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import EditOrderPage from './pages/EditOrderPage';
import AddNewFoodPage from './pages/AddNewFoodPage';
import FoodListPage from './pages/FoodListPage';
import FoodItemDetailsPage from './pages/FoodItemDetailsPage';
import AddNewIngredientPage from './pages/AddNewIngredientPage';
import IngredientDetailsPage from './pages/IngredientDetailsPage';
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

// Layout Components for each section
const OrdersLayout = () => (
  <div>
    <h2>Orders</h2>
    <Outlet />
  </div>
);

const MenuLayout = () => (
  <div>
    <h2>Menu</h2>
    <Outlet />
  </div>
);

const InventoryLayout = () => (
  <div>
    <h2>Inventory</h2>
    <Outlet />
  </div>
);

const UsersLayout = () => (
  <div>
    <h2>Users</h2>
    <Outlet />
  </div>
);

const SalesLayout = () => (
  <div>
    <h2>Sales</h2>
    <Outlet />
  </div>
);

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
            <Route path="orders" element={<OrdersLayout />}>
              <Route path="" element={<OrderListPage />} />
              <Route path="order-entry" element={<OrderEntryPage />} />
              <Route path="order/:orderId" element={<OrderDetailPage />} />
              <Route path="edit-order/:orderId" element={<EditOrderPage />} />
            </Route>

            {/* Menu Section */}
            <Route path="menu" element={<MenuLayout />}>
              <Route path="" element={<FoodListPage />} />
              <Route path="add-new-food" element={<AddNewFoodPage />} />
              <Route path="menu-item-details/:foodId" element={<FoodItemDetailsPage />} />
            </Route>

            {/* Inventory Section */}
            <Route path="inventory" element={<InventoryLayout />}>
              <Route path="" element={<IngredientListPage />} />
              <Route path="add-new-ingredient" element={<AddNewIngredientPage />} />
              <Route path="ingredient-details/:id" element={<IngredientDetailsPage />} />
              <Route path="inventory-status" element={<InventoryStatusPage />} />
            </Route>

            {/* Users Section */}
            <Route path="users" element={<UsersLayout />}>
              <Route path="" element={<UserListPage />} />
              <Route path="create-user" element={<CreateUserPage />} />
              <Route path="user-details/:id" element={<UserDetailsPage />} />
            </Route>

            {/* Sales Section */}
            <Route path="sales" element={<SalesLayout />}>
              <Route path="" element={<SalesReportPage />} />
              <Route path="sale-details/:saleId" element={<SaleDetailsPage />} />
            </Route>

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