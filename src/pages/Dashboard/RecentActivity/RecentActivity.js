import React, { useState } from 'react';
import { 
  ShoppingCart, User, Package, DollarSign, AlertTriangle, 
  TrendingUp, Clock, Filter, Download, Search, ChevronDown
} from 'lucide-react';
import './RecentActivity.css';

const RecentActivity = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Activity data
  const activities = [
    {
      id: 1,
      type: 'order',
      icon: ShoppingCart,
      iconColor: 'blue',
      title: 'New Order Received',
      description: 'Order #1234 placed by John Doe',
      amount: '$999.00',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'customer',
      icon: User,
      iconColor: 'green',
      title: 'New Customer Registered',
      description: 'jane.smith@email.com created an account',
      time: '15 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'product',
      icon: Package,
      iconColor: 'purple',
      title: 'Product Low Stock Alert',
      description: 'iPhone 15 Pro is running low on stock (15 units left)',
      time: '1 hour ago',
      read: false
    },
    {
      id: 4,
      type: 'payment',
      icon: DollarSign,
      iconColor: 'teal',
      title: 'Payment Received',
      description: 'Payment of $2,450.00 for Order #1230',
      time: '2 hours ago',
      read: true
    },
    {
      id: 5,
      type: 'order',
      icon: ShoppingCart,
      iconColor: 'blue',
      title: 'Order Shipped',
      description: 'Order #1232 has been shipped to Mike Johnson',
      time: '3 hours ago',
      read: true
    },
    {
      id: 6,
      type: 'alert',
      icon: AlertTriangle,
      iconColor: 'red',
      title: 'Payment Failed',
      description: 'Payment failed for Order #1235 - Insufficient funds',
      time: '4 hours ago',
      read: true
    },
    {
      id: 7,
      type: 'review',
      icon: TrendingUp,
      iconColor: 'orange',
      title: 'New Product Review',
      description: '5-star review received for MacBook Air M3',
      time: '5 hours ago',
      read: true
    },
    {
      id: 8,
      type: 'order',
      icon: ShoppingCart,
      iconColor: 'blue',
      title: 'Order Delivered',
      description: 'Order #1228 successfully delivered to Sarah Wilson',
      time: '6 hours ago',
      read: true
    },
    {
      id: 9,
      type: 'customer',
      icon: User,
      iconColor: 'green',
      title: 'VIP Customer',
      description: 'Customer spent over $5,000 this month',
      time: '8 hours ago',
      read: true
    },
    {
      id: 10,
      type: 'product',
      icon: Package,
      iconColor: 'purple',
      title: 'Product Back in Stock',
      description: 'AirPods Pro 2 is now back in stock',
      time: '10 hours ago',
      read: true
    }
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || activity.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: 'all', label: 'All Activity', count: activities.length },
    { id: 'order', label: 'Orders', count: activities.filter(a => a.type === 'order').length },
    { id: 'customer', label: 'Customers', count: activities.filter(a => a.type === 'customer').length },
    { id: 'product', label: 'Products', count: activities.filter(a => a.type === 'product').length },
    { id: 'alert', label: 'Alerts', count: activities.filter(a => a.type === 'alert').length }
  ];

  const unreadCount = activities.filter(a => !a.read).length;

  const getIconColorClass = (color) => {
    switch (color) {
      case 'blue': return 'icon-blue';
      case 'green': return 'icon-green';
      case 'purple': return 'icon-purple';
      case 'teal': return 'icon-teal';
      case 'red': return 'icon-red';
      case 'orange': return 'icon-orange';
      default: return 'icon-blue';
    }
  };

  return (
    <div className="recent-activity-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Recent Activity</h1>
          <p className="page-subtitle">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="activity-filters">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="activity-timeline">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div 
                key={activity.id} 
                className={`activity-card ${!activity.read ? 'unread' : ''} ${index === 0 ? 'first' : ''}`}
              >
                <div className={`activity-icon ${getIconColorClass(activity.iconColor)}`}>
                  <Icon size={20} />
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <h4 className="activity-title">{activity.title}</h4>
                    <span className="activity-time">
                      <Clock size={12} />
                      {activity.time}
                    </span>
                  </div>
                  <p className="activity-description">{activity.description}</p>
                  {activity.amount && (
                    <span className="activity-amount">{activity.amount}</span>
                  )}
                </div>
                <div className="activity-actions">
                  <button className="btn-icon" title="View Details">
                    <Search size={16} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-activities">
            <div className="no-activities-icon">
              <Filter size={48} />
            </div>
            <h3>No activities found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Load More */}
        {filteredActivities.length > 0 && (
          <div className="load-more-container">
            <button className="load-more-btn">
              Load More Activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;

