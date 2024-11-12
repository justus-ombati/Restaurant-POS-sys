import React, { useState, useEffect } from 'react';
import api from '../api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import SalesGraph from '../components/SalesGraph';

const SalesReportPage = () => {
  const [filter, setFilter] = useState('daily'); // Default filter
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const baseUrl = '/sales/getAllSales';
        // const url = `${baseUrl}/${filter}?date=${selectedDate}`;
        const url = `${baseUrl}/?date=${selectedDate}`;

        const response = await api.get(url);
        setSalesData(response.data);
        console.log(salesData)
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError(error.response?.data?.message || 'Failed to fetch sales data');
        setIsModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filter, selectedDate]);

  useEffect(() => {
      calcTotalSalesProfit();
  }, [salesData]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const calcTotalSalesProfit = () => {
    const totalSales =  salesData.reduce((total, sale) => total + sale.totalAmount, 0);
    const totalProfit = salesData.reduce((total, sale) => total + sale.profit, 0);
    setTotalSales(totalSales);
    setTotalProfit(totalProfit);
    console.log(totalSales)
    console.log(totalProfit)
  };

  const calcAvgSales = () => {
    const avgSales = totalSales / salesData.length;
    console.log(avgSales)
    return avgSales;
  }

  const calcAvgProfits = () => {
    const avgProfit = totalProfit / salesData.length;
    console.log(avgProfit)
    return avgProfit;
  }

  const handleViewSale = (saleId) => {
    navigate(`/${saleId}`)
  }

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  return (
    <div className="sales-report-page">
      <h2>Sales Report</h2>
      {isModalOpen && success && (
        <Modal
          type='success'
          title='Success'
          message={success}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
      {isModalOpen && error && (
        <Modal
          type="error"
          title="Error"
          message={error}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
      
      <div className="filter-container">
        <label htmlFor="filter">Filter by:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="date-picker-container">
        <label htmlFor="date">Select Date:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      {isLoading && <p>Fetching sales data...</p>}

      {salesData.length > 0 && (
        <div className="sales-summary">
          <p>Total Sales: {totalSales}</p>
          <p>Total Profits: {totalProfit}</p>
          <p>Number of Transactions: {salesData.length}</p>
          <p>Average order value: {calcAvgSales().toFixed(2)}</p>
          <p>Average profit per order: {calcAvgProfits().toFixed(2)}</p>
        </div>
      )}

      {salesData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Transaction Id</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Amount</th>
              <th>Profit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale._id}>
                <td>{sale._id}</td>
                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                <td>{sale.customer?.name || 'N/A'}</td>  {/* Handle missing customer */}
                <td>{sale.totalAmount}</td>
                <td>{sale.profit}</td>
                <td>
                    <Button type="view" label="View" onClick={() => handleViewSale(sale._id)} />
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

      {salesData.length === 0 && <p>No sales data found for the selected filter and date.</p>}
      <SalesGraph />
    </div>
  );
};

export default SalesReportPage;
