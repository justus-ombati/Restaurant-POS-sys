import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { AuthContext } from '../context/AuthContext';
import 'chart.js/auto';

const SalesGraph = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [filter, setFilter] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        let url = '';
        switch (filter) {
          case 'daily':
            url = `http://localhost:5000/sales/daily?date=${selectedDate}`;
            break;
          case 'weekly':
            url = `http://localhost:5000/sales/weekly?date=${selectedDate}`;
            break;
          case 'monthly':
            url = `http://localhost:5000/sales/monthly?date=${selectedDate}`;
            break;
          default:
            break;
        }

        const response = await axios.get(url, { headers });
        const salesData = response.data;

        const labels = salesData.map(data => {
          if (filter === 'daily') {
            return `${data._id}:00`;
          } else {
            return new Date(data._id).toLocaleDateString();
          }
        });

        const totalSales = salesData.map(data => data.totalSales);
        const totalProfits = salesData.map(data => data.totalProfit);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Total Sales',
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              data: totalSales,
            },
            {
              label: 'Total Profits',
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
              data: totalProfits,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError(error.response?.data?.message || 'Failed to fetch sales data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filter, selectedDate, token]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="sales-graph">
      <h2>Sales and Profit Graph</h2>

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

      {isLoading && <p>Loading data...</p>}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {chartData && (
        <Bar
          data={chartData}
          options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: filter === 'daily' ? 'Hour' : 'Date',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Amount',
                },
                beginAtZero: true,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default SalesGraph;
