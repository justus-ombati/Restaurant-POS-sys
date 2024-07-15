import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import SalesGraph from '../components/SalesGraph';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    // const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const token = user?.token;

  const [salesData, setSalesData] = useState([]); // State for overall sales data
  const [totalSales, setTotalSales] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today
  const [inventoryData, setInventoryData] = useState({}); // State for inventory data
  const [inventorySummary, setInventorySummary] = useState({}); // State for inventory data
  const [recentOrders, setRecentOrders] = useState([]); // State for recent orders
  
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const calcTotalSalesProfit = () => {
    console.log('calculating sales and profits')

    const totsales =  salesData.reduce((total, sale) => total + sale.totalAmount, 0);
    const totprofit = salesData.reduce((total, sale) => total + sale.profit, 0);
    setTotalSales(totsales);
    setTotalProfit(totprofit);
    console.log(totalSales)
    console.log(totalProfit)
  };
  // Function to get low stock ingredients
  const getLowStockIngredients = () => {
    if (!inventoryData.data) return []; // Handle case where data is not available

    const lowStockThreshold = 8;
    return inventoryData.data.filter((ingredient) => ingredient.amount <= lowStockThreshold);
  };

  // Function to get stock status based on quantity
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
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const { data: salesResponse } = await axios.get(`http://localhost:5000/sales/getAllSales?date=${selectedDate}`, { headers });
        console.log('Sales Response:', salesResponse);

        const { data: inventoryResponse } = await axios.get('http://localhost:5000/ingredient/', { headers });
        console.log('Inventory Response:', inventoryResponse);

        const { data: invSummaryResponse } = await axios.get('http://localhost:5000/ingredient/inventorySummary', { headers });
        console.log('Inventory Summary Response:', invSummaryResponse);

        const { data: recentOrdersResponse } = await axios.get('http://localhost:5000/order/', { headers });
        console.log('Recent Orders Response:', recentOrdersResponse);

        setSalesData(salesResponse || []);
        setInventoryData(inventoryResponse || []);
        setInventorySummary(invSummaryResponse || {});
        setRecentOrders(recentOrdersResponse.data || []);
 

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [token, selectedDate]);

  useEffect(() => {
    calcTotalSalesProfit();
  }, [salesData]);

  console.log(salesData)
  console.log(inventoryData)
  console.log(inventorySummary)
  console.log(recentOrders)
  console.log(totalSales)
  console.log(totalProfit)


  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="headline">
      <div className="date-picker-container">
        <label htmlFor="date">Select Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
        <p>Total Sales: {totalSales}</p>
        <p>Total Profits: {totalProfit}</p>
        {/* <p>Orders Completed: {completedOrders}</p> */}
      </div>

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
