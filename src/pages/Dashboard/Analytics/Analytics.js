import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
  ArrowUpRight, ArrowDownRight, Eye, Edit, Trash2, MoreHorizontal,
  RefreshCw, Download, Calendar, Target, Zap
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  Legend, RadialBarChart, RadialBar
} from 'recharts';
import './Analytics.css';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Key Metrics
  const metrics = [
    {
      label: 'Total Revenue',
      value: 'pkr124,563',
      change: '+12.5%',
      trend: 'up',
      target: 'pkr150,000',
      progress: 83,
      icon: DollarSign,
      color: 'blue'
    },
    {
      label: 'Conversion Rate',
      value: '3.24%',
      change: '+0.8%',
      trend: 'up',
      target: '4.0%',
      progress: 81,
      icon: Target,
      color: 'green'
    },
    {
      label: 'Avg Order Value',
      value: 'pkr127.50',
      change: '-2.1%',
      trend: 'down',
      target: 'pkr140.00',
      progress: 91,
      icon: ShoppingCart,
      color: 'purple'
    },
    {
      label: 'Customer Lifetime Value',
      value: 'pkr458.00',
      change: '+5.4%',
      trend: 'up',
      target: 'pkr500.00',
      progress: 92,
      icon: Users,
      color: 'orange'
    }
  ];

  // Sales Trend Data
  const salesTrendData = [
    { name: 'Jan', revenue: 45000, orders: 380, visitors: 12500 },
    { name: 'Feb', revenue: 52000, orders: 420, visitors: 14200 },
    { name: 'Mar', revenue: 48000, orders: 395, visitors: 13800 },
    { name: 'Apr', revenue: 61000, orders: 510, visitors: 16500 },
    { name: 'May', revenue: 55000, orders: 460, visitors: 15200 },
    { name: 'Jun', revenue: 67000, orders: 560, visitors: 17800 },
    { name: 'Jul', revenue: 72000, orders: 600, visitors: 19200 },
    { name: 'Aug', revenue: 78000, orders: 650, visitors: 21000 },
    { name: 'Sep', revenue: 85000, orders: 710, visitors: 23500 },
    { name: 'Oct', revenue: 92000, orders: 770, visitors: 25800 },
    { name: 'Nov', revenue: 110000, orders: 920, visitors: 32000 },
    { name: 'Dec', revenue: 125000, orders: 1050, visitors: 38500 }
  ];

  // Traffic Sources
  const trafficData = [
    { name: 'Organic Search', value: 45, color: '#3b82f6' },
    { name: 'Direct', value: 25, color: '#10b981' },
    { name: 'Social Media', value: 15, color: '#f59e0b' },
    { name: 'Referral', value: 10, color: '#8b5cf6' },
    { name: 'Email', value: 5, color: '#ec4899' }
  ];

  // Device Distribution
  const deviceData = [
    { name: 'Mobile', value: 58, fill: '#3b82f6' },
    { name: 'Desktop', value: 35, fill: '#10b981' },
    { name: 'Tablet', value: 7, fill: '#f59e0b' }
  ];

  // Hourly Activity
  const hourlyData = [
    { hour: '6AM', orders: 12, revenue: 1500 },
    { hour: '8AM', orders: 35, revenue: 4200 },
    { hour: '10AM', orders: 78, revenue: 9500 },
    { hour: '12PM', orders: 125, revenue: 15800 },
    { hour: '2PM', orders: 95, revenue: 12100 },
    { hour: '4PM', orders: 110, revenue: 14200 },
    { hour: '6PM', orders: 145, revenue: 18500 },
    { hour: '8PM', orders: 132, revenue: 16800 },
    { hour: '10PM', orders: 68, revenue: 8500 },
    { hour: '12AM', orders: 25, revenue: 3200 }
  ];

  // Weekly Performance
  const weeklyData = [
    { day: 'Mon', revenue: 12500, orders: 98 },
    { day: 'Tue', revenue: 14200, orders: 112 },
    { day: 'Wed', revenue: 11800, orders: 94 },
    { day: 'Thu', revenue: 16500, orders: 130 },
    { day: 'Fri', revenue: 19800, orders: 156 },
    { day: 'Sat', revenue: 22500, orders: 178 },
    { day: 'Sun', revenue: 18200, orders: 144 }
  ];

  return (
    <div className="analytics-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Deep dive into your store performance and metrics.</p>
        </div>
        <div className="page-actions">
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
              onClick={() => setActiveTab('sales')}
            >
              Sales
            </button>
            <button 
              className={`tab-btn ${activeTab === 'traffic' ? 'active' : ''}`}
              onClick={() => setActiveTab('traffic')}
            >
              Traffic
            </button>
          </div>
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
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="metric-card card-hover">
              <div className="metric-header">
                <div className={`metric-icon ${metric.color}`}>
                  <Icon size={20} />
                </div>
                <div className={`metric-trend ${metric.trend}`}>
                  {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="metric-body">
                <p className="metric-value">{metric.value}</p>
                <p className="metric-label">{metric.label}</p>
              </div>
              <div className="metric-footer">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${metric.progress}%`, backgroundColor: metric.color === 'blue' ? '#3b82f6' : metric.color === 'green' ? '#10b981' : metric.color === 'purple' ? '#8b5cf6' : '#f59e0b' }}
                  ></div>
                </div>
                <span className="progress-label">{metric.target} target</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts */}
      <div className="analytics-charts-grid">
        {/* Sales Trend Chart */}
        <div className="analytics-card large">
          <div className="card-header">
            <h3 className="card-title">Sales Trend</h3>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot blue"></span>Revenue</span>
              <span className="legend-item"><span className="legend-dot green"></span>Orders</span>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={salesTrendData}>
                <defs>
                  <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} tickFormatter={(value) => `pkr${(value/1000)}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? `pkr${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]}
                />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue2)" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">Traffic Sources</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value) => [`${value}%`, 'Traffic']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="traffic-legend">
              {trafficData.map((source) => (
                <div key={source.name} className="traffic-legend-item">
                  <span className="traffic-color" style={{ backgroundColor: source.color }}></span>
                  <span className="traffic-name">{source.name}</span>
                  <span className="traffic-value">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="analytics-charts-grid secondary">
        {/* Weekly Performance */}
        <div className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">Weekly Performance</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `pkr${(value/1000)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value) => [`pkr${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Activity */}
        <div className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">Hourly Activity</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorOrders)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">Device Distribution</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={deviceData} startAngle={180} endAngle={0}>
                <RadialBar
                  minAngle={15}
                  label={{ position: 'insideStart', fill: '#fff', fontSize: 11 }}
                  background
                  clockWise={true}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </RadialBar>
                <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value) => [`${value}%`, 'Share']}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

