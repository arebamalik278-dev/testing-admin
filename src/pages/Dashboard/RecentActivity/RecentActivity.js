import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingCart, User, Package, DollarSign, AlertTriangle, 
  TrendingUp, Clock, Filter, Download, Search, ChevronDown,
  ArrowUpRight, ArrowDownRight, Users, ShoppingBag, AlertCircle, RefreshCw,
  Activity
} from 'lucide-react';
import api from '../../../api/api';
import './RecentActivity.css';

const RecentActivity = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    newCustomers: 0,
    revenueToday: 0,
    pendingAlerts: 0,
    ordersChange: 0,
    customersChange: 0,
    revenueChange: 0,
    alertsChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping for activity types
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'ShoppingCart': return ShoppingCart;
      case 'User': return User;
      case 'Package': return Package;
      case 'AlertTriangle': return AlertTriangle;
      default: return Activity;
    }
  };

  // Fetch activities from API
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/dashboard/recent-activity');
      if (data.success) {
        setActivities(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err.message || 'Failed to fetch activities');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      const data = await api.get('/dashboard/stats');
      if (data.success) {
        setStats({
          totalOrders: data.data.totalOrders || 0,
          newCustomers: data.data.totalCustomers || 0,
          revenueToday: data.data.todayRevenue || 0,
          pendingAlerts: data.data.pendingOrders || 0,
          ordersChange: data.data.ordersChange || 0,
          customersChange: data.data.customersChange || 0,
          revenueChange: data.data.revenueChange || 0,
          alertsChange: -5.1
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Set default values on error
      setStats({
        totalOrders: 0,
        newCustomers: 0,
        revenueToday: 0,
        pendingAlerts: 0,
        ordersChange: 0,
        customersChange: 0,
        revenueChange: 0,
        alertsChange: 0
      });
    }
  };

  // Generate activities from database data
  const generateActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.post('/dashboard/generate-activities', {});
      if (data.success) {
        setActivities(data.data || []);
      }
    } catch (err) {
      console.error('Error generating activities:', err);
      setError(err.message || 'Failed to generate activities');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const initData = async () => {
      await fetchStats();
      await fetchActivities();
    };
    initData();
  }, [fetchActivities]);

  // Filter activities based on search and tab
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleRefresh = () => {
    fetchActivities();
    fetchStats();
  };

  if (loading && activities.length === 0) {
    return (
      <div className="recent-activity-page animate-fade-in">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

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
          <button className="btn btn-secondary" onClick={handleRefresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn btn-primary">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={generateActivities} className="btn btn-primary btn-sm">
            Generate Activities
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card animate-slide-up" style={{ animationDelay: '0s' }}>
          <div className="stat-card-header">
            <div className="stat-icon-wrapper blue">
              <ShoppingBag size={22} />
            </div>
            <div className={`stat-trend ${stats.ordersChange >= 0 ? 'up' : 'down'}`}>
              {stats.ordersChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {stats.ordersChange >= 0 ? '+' : ''}{stats.ordersChange}%
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-value">{stats.totalOrders.toLocaleString()}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>

        <div className="stat-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card-header">
            <div className="stat-icon-wrapper green">
              <Users size={22} />
            </div>
            <div className={`stat-trend ${stats.customersChange >= 0 ? 'up' : 'down'}`}>
              {stats.customersChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {stats.customersChange >= 0 ? '+' : ''}{stats.customersChange}%
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-value">{stats.newCustomers.toLocaleString()}</span>
            <span className="stat-label">New Customers</span>
          </div>
        </div>

        <div className="stat-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="stat-card-header">
            <div className="stat-icon-wrapper teal">
              <DollarSign size={22} />
            </div>
            <div className={`stat-trend ${stats.revenueChange >= 0 ? 'up' : 'down'}`}>
              {stats.revenueChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}%
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-value">Rs {stats.revenueToday.toLocaleString()}</span>
            <span className="stat-label">Revenue Today</span>
          </div>
        </div>

        <div className="stat-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="stat-card-header">
            <div className="stat-icon-wrapper red">
              <AlertCircle size={22} />
            </div>
            <div className={`stat-trend ${stats.alertsChange >= 0 ? 'up' : 'down'}`}>
              {stats.alertsChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {stats.alertsChange >= 0 ? '+' : ''}{stats.alertsChange}%
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-value">{stats.pendingAlerts}</span>
            <span className="stat-label">Pending Alerts</span>
          </div>
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
            const Icon = getIcon(activity.icon);
            return (
              <div 
                key={activity._id || activity.id} 
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
                      {formatTime(activity.createdAt)}
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
            <p>Generate activities from your database data</p>
            <button className="btn btn-primary" onClick={generateActivities}>
              Generate Activities from Database
            </button>
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
