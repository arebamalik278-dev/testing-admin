import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
  RefreshCw, Download, Target
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  Legend, RadialBarChart, RadialBar
} from 'recharts';
import api from '../../../api/api';
import './Analytics.css';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for analytics data
  const [metrics, setMetrics] = useState([]);
  const [salesTrendData, setSalesTrendData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Fetch metrics data
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await api.get(`/dashboard/analytics/metrics?timeRange=${timeRange}`);
      if (response.success && response.data) {
        const data = response.data;
        setMetrics([
          {
            label: 'Total Revenue',
            value: formatCurrency(data.totalRevenue || 0),
            change: `${(data.revenueChange || 0).toFixed(1)}%`,
            trend: (data.revenueChange || 0) >= 0 ? 'up' : 'down',
            target: formatCurrency(data.revenueTarget || 150000),
            progress: Math.min(((data.totalRevenue || 0) / (data.revenueTarget || 150000)) * 100, 100),
            icon: DollarSign,
            color: 'blue'
          },
          {
            label: 'Total Visitors',
            value: (data.totalVisitors || 0).toLocaleString(),
            change: `${(data.visitorsChange || 0).toFixed(1)}%`,
            trend: (data.visitorsChange || 0) >= 0 ? 'up' : 'down',
            target: '10000',
            progress: Math.min(((data.totalVisitors || 0) / 10000) * 100, 100),
            icon: Users,
            color: 'green'
          },
          {
            label: 'Avg Order Value',
            value: formatCurrency(data.avgOrderValue || 0),
            change: `${(data.avgOrderValueChange || 0).toFixed(1)}%`,
            trend: (data.avgOrderValueChange || 0) >= 0 ? 'up' : 'down',
            target: formatCurrency(data.avgOrderValueTarget || 140),
            progress: Math.min(((data.avgOrderValue || 0) / (data.avgOrderValueTarget || 140)) * 100, 100),
            icon: ShoppingCart,
            color: 'purple'
          },
          {
            label: 'Customer Lifetime Value',
            value: formatCurrency(data.customerLifetimeValue || 0),
            change: `${(data.clvChange || 0).toFixed(1)}%`,
            trend: (data.clvChange || 0) >= 0 ? 'up' : 'down',
            target: formatCurrency(data.clvTarget || 500),
            progress: Math.min(((data.customerLifetimeValue || 0) / (data.clvTarget || 500)) * 100, 100),
            icon: Users,
            color: 'orange'
          }
        ]);
        setError(null);
      } else {
        setError(response.message || 'Failed to load metrics');
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError('Failed to load metrics data');
    }
  }, [timeRange]);

  // Fetch sales trend data
  const fetchSalesTrend = useCallback(async () => {
    try {
      const response = await api.get(`/dashboard/analytics/sales-trend?timeRange=${timeRange}`);
      if (response.success && response.data) {
        setSalesTrendData(response.data);
      } else {
        setSalesTrendData([]);
      }
    } catch (err) {
      console.error('Error fetching sales trend:', err);
      setSalesTrendData([]);
    }
  }, [timeRange]);

  // Fetch traffic sources data
  const fetchTrafficSources = useCallback(async () => {
    try {
      const response = await api.get(`/dashboard/analytics/traffic-sources?timeRange=${timeRange}`);
      if (response.success && response.data) {
        setTrafficData(response.data);
      } else {
        setTrafficData([]);
      }
    } catch (err) {
      console.error('Error fetching traffic sources:', err);
      setTrafficData([]);
    }
  }, [timeRange]);

  // Fetch device distribution data
  const fetchDeviceDistribution = useCallback(async () => {
    try {
      const response = await api.get(`/dashboard/analytics/device-distribution?timeRange=${timeRange}`);
      if (response.success && response.data) {
        setDeviceData(response.data);
      } else {
        setDeviceData([]);
      }
    } catch (err) {
      console.error('Error fetching device distribution:', err);
      setDeviceData([]);
    }
  }, [timeRange]);

  // Fetch hourly activity data
  const fetchHourlyActivity = useCallback(async () => {
    try {
      const response = await api.get(`/dashboard/analytics/hourly-activity?timeRange=${timeRange}`);
      if (response.success && response.data) {
        setHourlyData(response.data);
      } else {
        setHourlyData([]);
      }
    } catch (err) {
      console.error('Error fetching hourly activity:', err);
      setHourlyData([]);
    }
  }, [timeRange]);

  // Fetch weekly performance data
  const fetchWeeklyPerformance = useCallback(async () => {
    try {
      const response = await api.get(`/dashboard/analytics/weekly-performance?timeRange=${timeRange}`);
      if (response.success && response.data) {
        setWeeklyData(response.data);
      } else {
        setWeeklyData([]);
      }
    } catch (err) {
      console.error('Error fetching weekly performance:', err);
      setWeeklyData([]);
    }
  }, [timeRange]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchMetrics(),
        fetchSalesTrend(),
        fetchTrafficSources(),
        fetchDeviceDistribution(),
        fetchHourlyActivity(),
        fetchWeeklyPerformance()
      ]);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [fetchMetrics, fetchSalesTrend, fetchTrafficSources, fetchDeviceDistribution, fetchHourlyActivity, fetchWeeklyPerformance]);

  // Fetch data on timeRange change
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Refresh data
  const handleRefresh = () => {
    fetchAllData();
  };

  // Calculate progress for metrics
  const calculateProgress = (value, target) => {
    return Math.min((value / target) * 100, 100);
  };

  // Get trend icon and color
  const getTrendStyle = (trend) => {
    return trend === 'up' ? 'up' : 'down';
  };

  if (loading && metrics.length === 0) {
    return (
      <div className="analytics-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error && metrics.length === 0) {
    return (
      <div className="analytics-page">
        <div className="error-container">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleRefresh}>
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          <button className="btn btn-secondary" onClick={handleRefresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
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
                    name === 'revenue' ? 'Revenue' : name === 'orders' ? 'Orders' : name
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
