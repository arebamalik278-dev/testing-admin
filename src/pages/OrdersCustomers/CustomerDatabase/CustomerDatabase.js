import React, { useState } from 'react';
import { 
  Users, UserPlus, Mail, Phone, MapPin, Calendar,
  Search, Filter, Download, MoreHorizontal, Eye, 
  Trash2, Edit, MessageSquare, X, ChevronDown
} from 'lucide-react';
import './CustomerDatabase.css';

const CustomerDatabase = () => {
  const [customers, setCustomers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john.doe@email.com', 
      phone: '+1 234-567-8901',
      avatar: 'https://via.placeholder.com/100/3b82f6/ffffff?text=JD',
      location: 'New York, USA',
      joinDate: '2023-01-15',
      orders: 12,
      totalSpent: 4599.00,
      lastOrder: '2024-01-10',
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane.smith@email.com', 
      phone: '+1 234-567-8902',
      avatar: 'https://via.placeholder.com/100/10b981/ffffff?text=JS',
      location: 'Los Angeles, USA',
      joinDate: '2023-02-20',
      orders: 8,
      totalSpent: 2899.00,
      lastOrder: '2024-01-08',
      status: 'active'
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      email: 'mike.j@email.com', 
      phone: '+1 234-567-8903',
      avatar: 'https://via.placeholder.com/100/8b5cf6/ffffff?text=MJ',
      location: 'Chicago, USA',
      joinDate: '2023-03-10',
      orders: 15,
      totalSpent: 7899.00,
      lastOrder: '2024-01-12',
      status: 'active'
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      email: 'sarah.w@email.com', 
      phone: '+1 234-567-8904',
      avatar: 'https://via.placeholder.com/100/f59e0b/ffffff?text=SW',
      location: 'Houston, USA',
      joinDate: '2023-04-05',
      orders: 3,
      totalSpent: 899.00,
      lastOrder: '2023-12-15',
      status: 'inactive'
    },
    { 
      id: 5, 
      name: 'Tom Brown', 
      email: 'tom.b@email.com', 
      phone: '+1 234-567-8905',
      avatar: 'https://via.placeholder.com/100/ec4899/ffffff?text=TB',
      location: 'Phoenix, USA',
      joinDate: '2023-05-18',
      orders: 22,
      totalSpent: 12599.00,
      lastOrder: '2024-01-14',
      status: 'active'
    },
    { 
      id: 6, 
      name: 'Emily Davis', 
      email: 'emily.d@email.com', 
      phone: '+1 234-567-8906',
      avatar: 'https://via.placeholder.com/100/06b6d4/ffffff?text=ED',
      location: 'Seattle, USA',
      joinDate: '2023-06-22',
      orders: 7,
      totalSpent: 2349.00,
      lastOrder: '2024-01-05',
      status: 'active'
    },
    { 
      id: 7, 
      name: 'Chris Lee', 
      email: 'chris.l@email.com', 
      phone: '+1 234-567-8907',
      avatar: 'https://via.placeholder.com/100/ef4444/ffffff?text=CL',
      location: 'Boston, USA',
      joinDate: '2023-07-30',
      orders: 5,
      totalSpent: 1599.00,
      lastOrder: '2023-11-20',
      status: 'inactive'
    },
    { 
      id: 8, 
      name: 'Amanda Taylor', 
      email: 'amanda.t@email.com', 
      phone: '+1 234-567-8908',
      avatar: 'https://via.placeholder.com/100/6366f1/ffffff?text=AT',
      location: 'Miami, USA',
      joinDate: '2023-08-12',
      orders: 18,
      totalSpent: 8999.00,
      lastOrder: '2024-01-11',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

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
    totalOrders: customers.reduce((sum, c) => sum + c.orders, 0),
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
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
            <p className="summary-value">${summaryStats.totalRevenue.toLocaleString()}</p>
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
                    <span className="spent-cell">${customer.totalSpent.toLocaleString()}</span>
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
                  <p className="stat-value">${selectedCustomer.totalSpent.toLocaleString()}</p>
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

