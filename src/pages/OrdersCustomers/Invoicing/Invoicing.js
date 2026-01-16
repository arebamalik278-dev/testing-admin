import React, { useState } from 'react';
import { 
  FileText, DollarSign, Clock, CheckCircle, XCircle, 
  Search, Download, Send, Eye, Filter, Calendar,
  ChevronDown, Printer, MoreHorizontal, X, Plus
} from 'lucide-react';
import './Invoicing.css';

const Invoicing = () => {
  const [invoices, setInvoices] = useState([
    { id: 'INV-001', orderId: '#1234', customer: { name: 'John Doe', email: 'john.doe@email.com' }, date: '2024-01-15', dueDate: '2024-01-30', amount: 999.00, status: 'paid', items: [{ description: 'iPhone 15 Pro', quantity: 1, price: 999.00 }] },
    { id: 'INV-002', orderId: '#1235', customer: { name: 'Jane Smith', email: 'jane.smith@email.com' }, date: '2024-01-14', dueDate: '2024-01-29', amount: 2499.00, status: 'pending', items: [{ description: 'MacBook Air M3', quantity: 1, price: 1099.00 }, { description: 'AirPods Pro 2', quantity: 2, price: 498.00 }, { description: 'USB-C Hub', quantity: 2, price: 199.00 }] },
    { id: 'INV-003', orderId: '#1236', customer: { name: 'Mike Johnson', email: 'mike.j@email.com' }, date: '2024-01-13', dueDate: '2024-01-28', amount: 1847.00, status: 'overdue', items: [{ description: 'iPad Pro 12.9"', quantity: 1, price: 1099.00 }, { description: 'Apple Pencil', quantity: 1, price: 129.00 }, { description: 'Smart Keyboard', quantity: 1, price: 349.00 }] },
    { id: 'INV-004', orderId: '#1237', customer: { name: 'Sarah Wilson', email: 'sarah.w@email.com' }, date: '2024-01-12', dueDate: '2024-01-27', amount: 799.00, status: 'paid', items: [{ description: 'Apple Watch Ultra', quantity: 1, price: 799.00 }] },
    { id: 'INV-005', orderId: '#1238', customer: { name: 'Tom Brown', email: 'tom.b@email.com' }, date: '2024-01-11', dueDate: '2024-01-26', amount: 349.00, status: 'pending', items: [{ description: 'Nintendo Switch OLED', quantity: 1, price: 349.00 }] },
    { id: 'INV-006', orderId: '#1239', customer: { name: 'Emily Davis', email: 'emily.d@email.com' }, date: '2024-01-10', dueDate: '2024-01-25', amount: 1348.00, status: 'paid', items: [{ description: 'Sony WH-1000XM5', quantity: 2, price: 698.00 }, { description: 'Phone Case', quantity: 2, price: 49.00 }] },
    { id: 'INV-007', orderId: '#1240', customer: { name: 'Chris Lee', email: 'chris.l@email.com' }, date: '2024-01-09', dueDate: '2024-01-24', amount: 5499.00, status: 'overdue', items: [{ description: 'iPhone 15 Pro Max', quantity: 1, price: 1199.00 }, { description: 'iPad Pro 11"', quantity: 2, price: 1598.00 }, { description: 'Apple Pencil x2', quantity: 2, price: 258.00 }] },
    { id: 'INV-008', orderId: '#1241', customer: { name: 'Amanda Taylor', email: 'amanda.t@email.com' }, date: '2024-01-08', dueDate: '2024-01-23', amount: 2198.00, status: 'pending', items: [{ description: 'MacBook Pro 14"', quantity: 1, price: 1999.00 }, { description: 'Dongle Adapter', quantity: 1, price: 79.00 }] }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

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
              {filteredInvoices.map(invoice => (
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
              ))}
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

