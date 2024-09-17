import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { useParams } from 'react-router-dom';
import printJS from 'print-js';

const SaleDetailsPage = () => {
  const { saleId } = useParams();
  const [saleDetails, setSaleDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    const fetchSaleDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(`/sales/${saleId}`);
        setSaleDetails(response.data);
      } catch (error) {
        console.error('Error fetching sale details:', error);
        setError(error.response?.data?.message || 'Failed to fetch sale details');
        setIsModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaleDetails();
  }, [saleId]);

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

  const handlePrint = () => {
    printJS({
      printable: printRef.current,
      type: 'html',
      scanStyles: false,
      style: `
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      `
    });
  };

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  return (
    <div className="sales-detail-page">
      <h2>Sale Details</h2>

      {isLoading && <p>Fetching sale details...</p>}
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
      
      {saleDetails._id && (
        <div id="sale-details" ref={printRef}>
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
          <button onClick={handlePrint}>Print Receipt</button>
        </div>
      )}

      {!saleDetails._id && <p>Sale details not found.</p>}
    </div>
  );
};

export default SaleDetailsPage;
