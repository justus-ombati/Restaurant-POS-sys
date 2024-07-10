import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext


const SaleDetailsPage = ({ match }) => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [saleDetails, setSaleDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSaleDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const headers = {};

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const { saleId } = match.params;
        const response = await axios.get(`http://localhost:5000/sales/${saleId}`);
        setSaleDetails(response.data);
      } catch (error) {
        console.error('Error fetching sale details:', error);
        setError(error.response?.data?.message || 'Failed to fetch sale details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaleDetails();
  }, [match]);

  const renderItemsSold = () => {
    if (!saleDetails.order?.items) return null;

    return saleDetails.order.items.map((item) => (
      <tr key={item._id}>
        <td>{item.itemName}</td>
        <td>{item.quantity}</td>
        <td>{item.sellingPrice}</td>
        <td>{item.quantity * item.sellingPrice}</td>
      </tr>
    ));
  };

  return (
    <div className="sales-detail-page">
      <h2>Sale Details</h2>

      {isLoading && <p>Fetching sale details...</p>}

      {error && (
        <p style={{ color: 'red' }}>Error: {error}</p>
      )}

      {saleDetails._id && (
        <div>
          <p>Transaction ID: {saleDetails._id}</p>
          <p>Customer Name: {saleDetails.order.customerName}</p>
          <p>Date: {new Date(saleDetails.createdAt).toLocaleDateString()}</p>
          <p>Total Amount: {saleDetails.totalAmount}</p>

          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>{renderItemsSold()}</tbody>
          </table>
        </div>
      )}

      {!saleDetails._id && <p>Sale details not found.</p>}
    </div>
  );
};

export default SaleDetailsPage;
