import React, { useState, useEffect } from 'react';
import { Eye, Download } from 'lucide-react';
import api from '../../../api/api';
import './OrderTracking.css';

const OrderTracking = () => {
  const [orders, setOrders] = useState([
    { id: '#ORD-001', customer: 'John Doe', date: '2026-01-10', total: 299.99, status: 'Delivered', items: 3 },
    { id: '#ORD-002', customer: 'Jane Smith', date: '2026-01-11', total: 159.99, status: 'Shipped', items: 2 },
    { id: '#ORD-003', customer: 'Bob Johnson', date: '2026-01-12', total: 499.99, status: 'Processing', items: 5 },
    { id: '#ORD-004', customer: 'Alice Brown', date: '2026-01-12', total: 89.99, status: 'Pending', items: 1 }
  ]);

  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        // const data = await api.get('/api/orders');
        // setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    // fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    const statusClasses = {
      'Delivered': 'status-delivered',
      'Shipped': 'status-shipped',
      'Processing': 'status-processing',
      'Pending': 'status-pending'
    };
    return statusClasses[status] || 'status-pending';
  };

  return (
    <div className="order-tracking-container">
      <h2 className="page-title">Order Tracking</h2>

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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td className="order-customer">{order.customer}</td>
                  <td className="text-gray">{order.date}</td>
                  <td className="text-gray">{order.items} items</td>
                  <td className="order-total">${order.total}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;