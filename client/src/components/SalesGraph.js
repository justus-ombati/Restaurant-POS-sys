import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../api';
import 'chart.js/auto';

const SalesGraph = () => {
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
        let url = '';
        switch (filter) {
          case 'daily':
            url = `/sales/daily?date=${selectedDate}`;
            break;
          case 'weekly':
            url = `/sales/weekly?date=${selectedDate}`;
            break;
          case 'monthly':
            url = `/sales/monthly?date=${selectedDate}`;
            break;
          default:
            break;
        }

        // Log the headers to check if Authorization header is included
        console.log('Request URL:', url);
        console.log('Request Headers:', api.defaults.headers);
        
        const response = await api.get(url);
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
  }, [filter, selectedDate]);

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
