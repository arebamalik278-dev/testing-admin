import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Mail, Phone, MapPin, Calendar,
  Search, Filter, Download, MoreHorizontal, Eye, 
  Trash2, Edit, MessageSquare, X, ChevronDown
} from 'lucide-react';
import './CustomerDatabase.css';
import api from '../../../api/api';

const CustomerDatabase = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  // Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/users');
        if (response.success) {
          setCustomers(response.data);
        } else {
          throw new Error('Failed to fetch customers');
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers. Please try again.');
        // Fallback to empty array
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const summaryStats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    totalOrders: customers.reduce((sum, c) => sum + (c.orders || 0), 0),
    totalRevenue: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge status-${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const viewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="customer-database-container animate-fade-in">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="customer-database-container animate-fade-in">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Customers</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-database-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Customer Database</h1>
          <p className="page-subtitle">Manage and view all your customers and their information.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">
            <Download size={16} />
            Export
          </button>
          <button className="btn btn-primary">
            <UserPlus size={16} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon blue">
            <Users size={20} />
          </div>
          <div className="summary-content">
            <p className="summary-value">{summaryStats.totalCustomers}</p>
            <p className="summary-label">Total Customers</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon green">
            <UserPlus size={20} />
          </div>
          <div className="summary-content">
            <p className="summary-value">{summaryStats.activeCustomers}</p>
            <p className="summary-label">Active Customers</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon purple">
            <Calendar size={20} />
          </div>
          <div className="summary-content">
            <p className="summary-value">{summaryStats.totalOrders}</p>
            <p className="summary-label">Total Orders</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon orange">
            <Users size={20} />
          </div>
          <div className="summary-content">
            <p className="summary-value">{`pkr${summaryStats.totalRevenue.toLocaleString()}`}</p>
            <p className="summary-label">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Join Date</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-cell">
                      <img src={customer.avatar} alt={customer.name} className="customer-avatar" />
                      <span className="customer-name">{customer.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <span className="email">{customer.email}</span>
                      <span className="phone">{customer.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="location-cell">
                      <MapPin size={14} />
                      {customer.location}
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={14} />
                      {customer.joinDate}
                    </div>
                  </td>
                  <td>
                    <span className="orders-cell">{customer.orders}</span>
                  </td>
                  <td>
                    <span className="spent-cell">{`pkr${(customer.totalSpent || 0).toLocaleString()}`}</span>
                  </td>
                  <td>{getStatusBadge(customer.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view" 
                        title="View Details"
                        onClick={() => viewCustomer(customer)}
                      >
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon btn-email" title="Send Email">
                        <Mail size={16} />
                      </button>
                      <button className="btn-icon btn-delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="pagination-btn" disabled>
          Previous
        </button>
        <span className="pagination-info">Showing {filteredCustomers.length} of {customers.length} customers</span>
        <button className="pagination-btn" disabled>
          Next
        </button>
      </div>

      {/* Customer Detail Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal customer-modal">
            <div className="modal-header">
              <h3 className="modal-title">Customer Details</h3>
              <button className="close-btn" onClick={() => setShowCustomerModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="customer-profile">
                <img 
                  src={selectedCustomer.avatar} 
                  alt={selectedCustomer.name} 
                  className="profile-avatar" 
                />
                <h4 className="profile-name">{selectedCustomer.name}</h4>
                {getStatusBadge(selectedCustomer.status)}
              </div>

              <div className="customer-details-grid">
                <div className="detail-item">
                  <Mail size={18} />
                  <div>
                    <p className="detail-label">Email</p>
                    <p className="detail-value">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Phone size={18} />
                  <div>
                    <p className="detail-label">Phone</p>
                    <p className="detail-value">{selectedCustomer.phone}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <MapPin size={18} />
                  <div>
                    <p className="detail-label">Location</p>
                    <p className="detail-value">{selectedCustomer.location}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Calendar size={18} />
                  <div>
                    <p className="detail-label">Member Since</p>
                    <p className="detail-value">{selectedCustomer.joinDate}</p>
                  </div>
                </div>
              </div>

              <div className="customer-stats">
                <div className="stat-card">
                  <Users size={20} />
                  <p className="stat-value">{selectedCustomer.orders}</p>
                  <p className="stat-label">Total Orders</p>
                </div>
                <div className="stat-card">
                  <Calendar size={20} />
                  <p className="stat-value">{`pkr${(selectedCustomer.totalSpent || 0).toLocaleString()}`}</p>
                  <p className="stat-label">Total Spent</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary">
                <MessageSquare size={16} />
                Send Message
              </button>
              <button className="btn btn-primary">
                <Edit size={16} />
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDatabase;

