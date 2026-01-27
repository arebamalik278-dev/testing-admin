import React, { useState, useEffect } from 'react';
import { Eye, Download } from 'lucide-react';
import api from '../../../api/api';
import './OrderTracking.css';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    const statusClasses = {
      'Delivered': 'status-delivered',
      'Shipped': 'status-shipped',
      'Processing': 'status-processing',
      'Pending': 'status-pending',
      'Cancelled': 'status-cancelled',
      'Refunded': 'status-refunded'
    };
    return statusClasses[status] || 'status-pending';
  };

  return (
    <div className="order-tracking-container">
      <h2 className="page-title">Order Tracking</h2>

      {loading && <div className="loading">Loading orders...</div>}
      
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">No orders found</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="order-id">{order.orderNumber}</td>
                      <td className="order-customer">{order.user?.name}</td>
                      <td className="text-gray">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="text-gray">{order.itemCount} items</td>
                      <td className="order-total">{`PKR ${order.grandTotal?.toFixed(2) || '0.00'}`}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon btn-view">
                            <Eye size={18} />
                          </button>
                          <button className="btn-icon btn-download">
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;