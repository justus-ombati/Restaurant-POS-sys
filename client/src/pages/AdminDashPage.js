import React, { useState, useEffect } from 'react';
import api from '../api';
import Headline from '../components/Headline';
import SalesGraph from '../components/SalesGraph';

const AdminDashboard = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inventoryData, setInventoryData] = useState({}); // State for inventory data
  const [inventorySummary, setInventorySummary] = useState({}); // State for inventory data
  const [recentOrders, setRecentOrders] = useState([]); // State for recent orders

  const getLowStockIngredients = () => {
    if (!inventoryData.data) return []; // Handle case where data is not available

    const lowStockThreshold = 8;
    return inventoryData.data.filter((ingredient) => ingredient.amount <= lowStockThreshold);
  };

  const getStockStatus = (quantity) => {
    if (!inventoryData.data) return 'Data Unavailable'; // Return a message if no data

    if (quantity === 0) return 'Out of stock';
    if (quantity <= 4) return 'Critically Low';
    if (quantity <= 8) return 'Running Low';
    return 'In plenty';
  };

  const renderRecentOrders = () => {
    if (!recentOrders.length) return 'no orders to show'; // Return null if no data

    return (
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Table</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.status}</td>
              <td>{order.tableNumber || '-'}</td>
              <td>{order.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: inventoryResponse } = await api.get('/ingredient/');
        console.log('Inventory Response:', inventoryResponse);

        const { data: invSummaryResponse } = await api.get('/ingredient/inventorySummary');
        console.log('Inventory Summary Response:', invSummaryResponse);

        const { data: recentOrdersResponse } = await api.get('/order/');
        console.log('Recent Orders Response:', recentOrdersResponse);

        setInventoryData(inventoryResponse || []);
        setInventorySummary(invSummaryResponse || {});
        setRecentOrders(recentOrdersResponse.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
        setIsModalOpen(true);
      }
    };

    fetchData();
  }, []);

  console.log(inventoryData);
  console.log(inventorySummary);
  console.log(recentOrders);

  return (
    <div className="admin-dashboard">
      {success && <Modal type='success' title='Success' message={success} isOpen={isModalOpen}/>}
      {error && <Modal type="error" title="Error" message={error} isOpen={isModalOpen}/>}
      <h2>Admin Dashboard</h2>
      <Headline />
      <div className="sales-trends">
        <h3>Sales Trends</h3>
        <SalesGraph />
      </div>
      <div className="inventory-status">
        <h3>Inventory Status</h3>
        <p>Total Inventory Value: Ksh {inventorySummary.totalValue || 0}</p>
        <h2>Low Stock Alerts</h2>
        {getLowStockIngredients().length === 0 ? (
          <p>No ingredients currently have low stock.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Remaining Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {getLowStockIngredients().map((ingredient) => (
                <tr key={ingredient._id}>
                  <td>{ingredient.name}</td>
                  <td>{ingredient.amount}</td>
                  <td>{getStockStatus(ingredient.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="recent-orders">
        <h3>Recent Orders (6am - 10pm)</h3>
        <table>
          <tbody>{renderRecentOrders()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
