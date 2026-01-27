import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
  ArrowUpRight, ArrowDownRight, Eye, Edit, Trash2, MoreHorizontal,
  RefreshCw, Download, Plus, AlertCircle
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import api from '../../../api/api';
import './Overview.css';

const Overview = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [stats, setStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  // Category colors for pie chart
  const categoryColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280', '#ef4444', '#ec4899'];

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        statsRes,
        revenueRes,
        categoryRes,
        ordersRes,
        productsRes
      ] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get(`/dashboard/revenue-chart?days=${timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365}`),
        api.get('/dashboard/category-distribution'),
        api.get('/dashboard/recent-orders?limit=5'),
        api.get('/dashboard/top-products?limit=5')
      ]);

      // Transform stats data
      if (statsRes.success) {
        const { data } = statsRes;
        setStats([
          {
            label: 'Total Revenue',
            value: `pkr${data.totalRevenue?.toLocaleString() || 0}`,
            change: `${data.revenueChange >= 0 ? '+' : ''}${data.revenueChange}%`,
            trend: data.revenueChange >= 0 ? 'up' : 'down',
            icon: DollarSign,
            color: 'blue'
          },
          {
            label: 'Total Orders',
            value: data.totalOrders?.toLocaleString() || '0',
            change: `${data.ordersChange >= 0 ? '+' : ''}${data.ordersChange}%`,
            trend: data.ordersChange >= 0 ? 'up' : 'down',
            icon: ShoppingCart,
            color: 'green'
          },
          {
            label: 'Total Customers',
            value: data.totalCustomers?.toLocaleString() || '0',
            change: `${data.customersChange >= 0 ? '+' : ''}${data.customersChange}%`,
            trend: data.customersChange >= 0 ? 'up' : 'down',
            icon: Users,
            color: 'purple'
          },
          {
            label: 'Products',
            value: data.totalProducts?.toLocaleString() || '0',
            change: `${data.productsChange >= 0 ? '+' : ''}${data.productsChange}%`,
            trend: data.productsChange >= 0 ? 'up' : 'down',
            icon: Package,
            color: 'orange'
          }
        ]);
      }

      // Transform revenue data
      if (revenueRes.success) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        setRevenueData(revenueRes.data.map(item => ({
          name: days[new Date(item.date).getDay()],
          revenue: item.revenue,
          orders: item.orders
        })));
      }

      // Transform category data with colors
      if (categoryRes.success) {
        setCategoryData(categoryRes.data.map((item, index) => ({
          name: item.category || 'Uncategorized',
          value: item.count,
          color: categoryColors[index % categoryColors.length]
        })));
      }

      // Transform recent orders
      if (ordersRes.success) {
        setRecentOrders(ordersRes.data.map(order => ({
          id: `#${order.orderNumber || order._id?.slice(-6)}`,
          customer: order.user?.name || order.customerName || 'Unknown',
          product: order.items?.[0]?.product?.name || order.items?.[0]?.name || 'Multiple Items',
          amount: `pkr${order.totalAmount?.toLocaleString() || 0}`,
          status: order.status,
          date: new Date(order.createdAt).toLocaleDateString()
        })));
      }

      // Transform top products
      if (productsRes.success) {
        setTopProducts(productsRes.data.map((item, index) => ({
          id: item.product?._id || index + 1,
          name: item.product?.name || 'Unknown Product',
          sales: item.sales,
          revenue: `pkr${item.revenue?.toLocaleString() || 0}`,
          trend: '+5%'
        })));
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Fetch data on component mount and when timeRange changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getStatusClass = (status) => {
    const statusMap = {
      'completed': 'active',
      'processing': 'processing',
      'pending': 'pending',
      'delivered': 'completed',
      'cancelled': 'cancelled'
    };
    return statusMap[status?.toLowerCase()] || '';
  };

  if (loading) {
    return (
      <div className="overview-page animate-fade-in">
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">Welcome back! Here's what's happening with your store.</p>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overview-page animate-fade-in">
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">Welcome back! Here's what's happening with your store.</p>
          </div>
        </div>
        <div className="error-container">
          <AlertCircle size={48} className="error-icon" />
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchDashboardData}>
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="page-actions">
          <select 
            className="time-range-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn btn-secondary" onClick={fetchDashboardData}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card card-hover">
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
                <div className={`stat-change ${stat.trend}`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  <span>{stat.change} from last period</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Revenue Chart */}
        <div className="chart-container large">
          <div className="chart-header">
            <h3 className="chart-title">Revenue Overview</h3>
            <div className="chart-filters">
              <select className="chart-filter-select">
                <option>Revenue</option>
                <option>Orders</option>
              </select>
            </div>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `pkr${value}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`pkr${value}`, '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="chart-container small">
          <div className="chart-header">
            <h3 className="chart-title">Sales by Category</h3>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value) => [`${value}`, 'Products']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="category-legend">
              {categoryData.map((category) => (
                <div key={category.name} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: category.color }}></span>
                  <span className="legend-label">{category.name}</span>
                  <span className="legend-value">{category.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <button className="btn btn-secondary btn-sm">View All</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <span className="order-id">{order.id}</span>
                      </td>
                      <td>{order.customer}</td>
                      <td className="amount">{order.amount}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">No recent orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Products</h3>
            <button className="btn btn-secondary btn-sm">View All</button>
          </div>
          <div className="top-products-list">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product.id} className="top-product-item">
                  <span className="product-rank">{index + 1}</span>
                  <div className="product-info">
                    <span className="product-name">{product.name}</span>
                    <span className="product-sales">{product.sales} sales</span>
                  </div>
                  <div className="product-stats">
                    <span className="product-revenue">{product.revenue}</span>
                    <span className="product-trend positive">{product.trend}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No top products data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
