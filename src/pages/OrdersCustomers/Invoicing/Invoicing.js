import React, { useState, useEffect } from 'react';
import { 
  FileText, DollarSign, Clock, CheckCircle, XCircle, 
  Search, Download, Send, Eye, Filter, Calendar,
  ChevronDown, Printer, MoreHorizontal, X, Plus
} from 'lucide-react';
import './Invoicing.css';
import api from '../../../api/api';

const Invoicing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders');
        
        // Check if orders data exists and is an array
        if (response.data && Array.isArray(response.data)) {
          // Transform orders to invoice format
          const transformedInvoices = response.data.map(order => ({
            id: `INV-${order.orderNumber.split('-').pop()}`,
            orderId: order.orderNumber,
            customer: { 
              name: order.user?.name || 'Unknown Customer', 
              email: order.user?.email || 'unknown@example.com' 
            },
            date: new Date(order.createdAt).toISOString().split('T')[0],
            dueDate: new Date(order.createdAt.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            amount: order.grandTotal,
            status: getInvoiceStatus(order.status, order.paymentInfo?.status),
            items: order.items.map(item => ({
              description: item.name,
              quantity: item.quantity,
              price: item.price
            }))
          }));
          setInvoices(transformedInvoices);
        } else {
          // If no data or invalid format, set to empty array
          setInvoices([]);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        // Don't set error state for no data, just set empty array
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper function to determine invoice status
  const getInvoiceStatus = (orderStatus, paymentStatus) => {
    if (paymentStatus === 'Completed') {
      return 'paid';
    }
    if (orderStatus === 'Cancelled' || orderStatus === 'Refunded') {
      return 'cancelled';
    }
    // Check if due date has passed
    const orderDate = new Date(); // This would be order.createdAt in real scenario
    const dueDate = new Date(orderDate.getTime() + 15 * 24 * 60 * 60 * 1000);
    if (new Date() > dueDate) {
      return 'overdue';
    }
    return 'pending';
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const summaryStats = {
    totalInvoices: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    pendingAmount: invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0),
    overdueAmount: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="status-badge status-paid">
            <CheckCircle size={12} />
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="status-badge status-pending">
            <Clock size={12} />
            Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="status-badge status-overdue">
            <XCircle size={12} />
            Overdue
          </span>
        );
      default:
        return null;
    }
  };

  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="invoicing-container animate-fade-in">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading invoices...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="invoicing-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Invoicing</h1>
          <p className="page-subtitle">Manage and track all your invoices and payments.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">
            <Download size={16} />
            Export
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon blue">
            <FileText size={20} />
          </div>
          <div className="summary-content">
            <p className="summary-value">{summaryStats.totalInvoices}</p>
            <p className="summary-label">Total Invoices</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon green">
            <DollarSign size={20} />
          </div>
          <div className="summary-content">
            <p className="summary-value">{`pkr${summaryStats.totalAmount.toLocaleString()}`}</p>
            <p className="summary-label">Total Amount</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon yellow">
            <Clock size={20} />
          </div>
          <div className="summary-content">
            <p className="summary-value">{`pkr${summaryStats.pendingAmount.toLocaleString()}`}</p>
            <p className="summary-label">Pending Payment</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon red">
            <XCircle size={20} />
          </div>
          <div className="summary-content">
            <p className="summary-value">{`pkr${summaryStats.overdueAmount.toLocaleString()}`}</p>
            <p className="summary-label">Overdue Amount</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search invoices..."
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td>
                      <span className="invoice-id">{invoice.id}</span>
                    </td>
                    <td>
                      <span className="order-link">{invoice.orderId}</span>
                    </td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">{invoice.customer.name}</span>
                        <span className="customer-email">{invoice.customer.email}</span>
                      </div>
                    </td>
                    <td>{invoice.date}</td>
                    <td>{invoice.dueDate}</td>
                    <td>
                      <span className="amount">{`pkr${invoice.amount.toLocaleString()}`}</span>
                    </td>
                    <td>{getStatusBadge(invoice.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon btn-view" 
                          title="View Invoice"
                          onClick={() => viewInvoice(invoice)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn-icon btn-send" 
                          title="Send Invoice"
                        >
                          <Send size={16} />
                        </button>
                        <button 
                          className="btn-icon btn-download" 
                          title="Download PDF"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    <div className="no-data-content">
                      <FileText size={48} className="no-data-icon" />
                      <p>No invoices found</p>
                      <p className="no-data-subtitle">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal invoice-modal">
            <div className="modal-header">
              <h3 className="modal-title">Invoice {selectedInvoice.id}</h3>
              <button className="close-btn" onClick={() => setShowInvoiceModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="invoice-header">
                <div className="invoice-info">
                  <p><strong>Invoice Date:</strong> {selectedInvoice.date}</p>
                  <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
                  <p><strong>Order ID:</strong> {selectedInvoice.orderId}</p>
                </div>
                <div className="customer-details">
                  <h4>Bill To:</h4>
                  <p>{selectedInvoice.customer.name}</p>
                  <p>{selectedInvoice.customer.email}</p>
                </div>
              </div>

              <div className="invoice-items">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{`pkr${item.price.toLocaleString()}`}</td>
                        <td>{`pkr${(item.quantity * item.price).toLocaleString()}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="invoice-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{`pkr${selectedInvoice.amount.toLocaleString()}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (0%):</span>
                  <span>pkr0.00</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>{`pkr${selectedInvoice.amount.toLocaleString()}`}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary">
                <Printer size={16} />
                Print
              </button>
              <button className="btn btn-secondary">
                <Download size={16} />
                Download PDF
              </button>
              <button className="btn btn-primary">
                <Send size={16} />
                Send Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoicing;

