import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
  ArrowUpRight, ArrowDownRight, Eye, Edit, Trash2, MoreHorizontal,
  RefreshCw, Download, Plus
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import './Overview.css';

const Overview = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Stats data
  const stats = [
    {
      label: 'Total Revenue',
      value: 'pkr124,563',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'green'
    },
    {
      label: 'Total Customers',
      value: '5,678',
      change: '+23.1%',
      trend: 'up',
      icon: Users,
      color: 'purple'
    },
    {
      label: 'Products',
      value: '342',
      change: '-2.4%',
      trend: 'down',
      icon: Package,
      color: 'orange'
    }
  ];

  // Revenue chart data
  const revenueData = [
    { name: 'Mon', revenue: 4000, orders: 24 },
    { name: 'Tue', revenue: 3000, orders: 18 },
    { name: 'Wed', revenue: 5000, orders: 35 },
    { name: 'Thu', revenue: 2780, orders: 22 },
    { name: 'Fri', revenue: 1890, orders: 15 },
    { name: 'Sat', revenue: 2390, orders: 20 },
    { name: 'Sun', revenue: 3490, orders: 28 }
  ];

  // Category distribution
  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3b82f6' },
    { name: 'Clothing', value: 25, color: '#10b981' },
    { name: 'Home & Garden', value: 20, color: '#f59e0b' },
    { name: 'Sports', value: 12, color: '#8b5cf6' },
    { name: 'Other', value: 8, color: '#6b7280' }
  ];

  // Recent orders
  const recentOrders = [
    { id: '#1234', customer: 'John Doe', product: 'iPhone 15 Pro', amount: 'pkr999', status: 'completed', date: '2 hours ago' },
    { id: '#1235', customer: 'Jane Smith', product: 'MacBook Air', amount: 'pkr1,299', status: 'processing', date: '3 hours ago' },
    { id: '#1236', customer: 'Bob Wilson', product: 'AirPods Pro', amount: 'pkr249', status: 'pending', date: '5 hours ago' },
    { id: '#1237', customer: 'Alice Brown', product: 'iPad Mini', amount: 'pkr599', status: 'completed', date: '6 hours ago' },
    { id: '#1238', customer: 'Charlie Davis', product: 'Watch Ultra', amount: 'pkr799', status: 'delivered', date: '8 hours ago' }
  ];

  // Top products
  const topProducts = [
    { id: 1, name: 'iPhone 15 Pro', sales: 234, revenue: 'pkr234,000', trend: '+15%' },
    { id: 2, name: 'MacBook Air M2', sales: 189, revenue: 'pkr245,000', trend: '+8%' },
    { id: 3, name: 'AirPods Pro', sales: 456, revenue: 'pkr113,000', trend: '+22%' },
    { id: 4, name: 'iPad Pro', sales: 167, revenue: 'pkr167,000', trend: '+5%' },
    { id: 5, name: 'Apple Watch', sales: 234, revenue: 'pkr70,000', trend: '+12%' }
  ];

  const getStatusClass = (status) => {
    const statusMap = {
      'completed': 'active',
      'processing': 'processing',
      'pending': 'pending',
      'delivered': 'completed',
      'cancelled': 'cancelled'
    };
    return statusMap[status] || '';
  };

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
          <button className="btn btn-secondary">
            <Download size={16} />
            Export
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
                  formatter={(value) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="category-legend">
              {categoryData.map((category) => (
                <div key={category.name} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: category.color }}></span>
                  <span className="legend-label">{category.name}</span>
                  <span className="legend-value">{category.value}%</span>
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
                {recentOrders.map((order) => (
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
                ))}
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
            {topProducts.map((product, index) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

