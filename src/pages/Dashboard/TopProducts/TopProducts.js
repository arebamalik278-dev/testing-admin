import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Star, Eye, ShoppingCart, 
  DollarSign, Package, Download, Filter, Search, ChevronDown,
  Grid, List
} from 'lucide-react';
import './TopProducts.css';

const TopProducts = () => {
  const [sortBy, setSortBy] = useState('revenue');
  const [timeRange, setTimeRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Top products data
  const topProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      sku: 'IPP-001',
      category: 'Electronics',
      image: 'https://via.placeholder.com/80x80/3b82f6/ffffff?text=iPhone',
      price: 279999,
      sales: 234,
      revenue: 65640000,
      trend: '+15.2%',
      trendDirection: 'up',
      rating: 4.8,
      reviews: 156,
      stock: 45,
      status: 'active'
    },
    {
      id: 2,
      name: 'MacBook Air M3',
      sku: 'MBA-002',
      category: 'Electronics',
      image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=MacBook',
      price: 309999,
      sales: 189,
      revenue: 58590000,
      trend: '+8.7%',
      trendDirection: 'up',
      rating: 4.9,
      reviews: 203,
      stock: 67,
      status: 'active'
    },
    {
      id: 3,
      name: 'AirPods Pro 2',
      sku: 'APP-003',
      category: 'Audio',
      image: 'https://via.placeholder.com/80x80/8b5cf6/ffffff?text=AirPods',
      price: 69999,
      sales: 456,
      revenue: 31920000,
      trend: '+22.1%',
      trendDirection: 'up',
      rating: 4.7,
      reviews: 312,
      stock: 123,
      status: 'active'
    },
    {
      id: 4,
      name: 'iPad Pro 12.9"',
      sku: 'IPP-004',
      category: 'Tablets',
      image: 'https://via.placeholder.com/80x80/f59e0b/ffffff?text=iPad',
      price: 309999,
      sales: 167,
      revenue: 51770000,
      trend: '+5.3%',
      trendDirection: 'up',
      rating: 4.6,
      reviews: 89,
      stock: 34,
      status: 'active'
    },
    {
      id: 5,
      name: 'Apple Watch Ultra',
      sku: 'AWU-005',
      category: 'Wearables',
      image: 'https://via.placeholder.com/80x80/ef4444/ffffff?text=Watch',
      price: 224999,
      sales: 145,
      revenue: 32625000,
      trend: '+12.8%',
      trendDirection: 'up',
      rating: 4.5,
      reviews: 78,
      stock: 23,
      status: 'low'
    },
    {
      id: 6,
      name: 'Sony WH-1000XM5',
      sku: 'SWH-006',
      category: 'Audio',
      image: 'https://via.placeholder.com/80x80/06b6d4/ffffff?text=Sony',
      price: 98999,
      sales: 178,
      revenue: 17622000,
      trend: '-3.2%',
      trendDirection: 'down',
      rating: 4.4,
      reviews: 145,
      stock: 89,
      status: 'active'
    },
    {
      id: 7,
      name: 'Nintendo Switch OLED',
      sku: 'NSO-007',
      category: 'Gaming',
      image: 'https://via.placeholder.com/80x80/ec4899/ffffff?text=Switch',
      price: 98999,
      sales: 134,
      revenue: 13266000,
      trend: '+18.9%',
      trendDirection: 'up',
      rating: 4.3,
      reviews: 67,
      stock: 12,
      status: 'low'
    },
    {
      id: 8,
      name: 'Samsung Galaxy S24',
      sku: 'SGS-008',
      category: 'Electronics',
      image: 'https://via.placeholder.com/80x80/6366f1/ffffff?text=Galaxy',
      price: 239999,
      sales: 123,
      revenue: 29520000,
      trend: '+7.1%',
      trendDirection: 'up',
      rating: 4.2,
      reviews: 98,
      stock: 56,
      status: 'active'
    }
  ];

  const filteredProducts = topProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b.revenue - a.revenue;
      case 'sales':
        return b.sales - a.sales;
      case 'rating':
        return b.rating - a.rating;
      case 'trend':
        return parseFloat(b.trend) - parseFloat(a.trend);
      default:
        return 0;
    }
  });

  const getStockStatus = (stock) => {
    if (stock < 25) return 'stock-critical';
    if (stock < 50) return 'stock-low';
    if (stock < 100) return 'stock-medium';
    return 'stock-high';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Electronics': '#3b82f6',
      'Audio': '#8b5cf6',
      'Tablets': '#f59e0b',
      'Wearables': '#10b981',
      'Gaming': '#ec4899'
    };
    return colors[category] || '#6b7280';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} fill="#fbbf24" color="#fbbf24" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} color="#e5e7eb" />);
    }

    return stars;
  };

  return (
    <div className="top-products-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Top Products</h1>
          <p className="page-subtitle">Your best performing products and their analytics.</p>
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
        </div>
      </div>

      {/* Filters and Search */}
      <div className="products-filters">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sort-controls">
          <label className="sort-label">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="revenue">Revenue</option>
            <option value="sales">Sales</option>
            <option value="rating">Rating</option>
            <option value="trend">Trend</option>
          </select>
        </div>

        <div className="view-toggle">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={18} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Top Products List */}
      {viewMode === 'grid' ? (
        <div className="products-grid">
          {sortedProducts.map((product, index) => (
            <div key={product.id} className="product-card">
              <div className="product-rank">{index + 1}</div>
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-details">
                <div className="product-header">
                  <h3 className="product-name">{product.name}</h3>
                  <span 
                    className="product-category"
                    style={{ backgroundColor: `${getCategoryColor(product.category)}20`, color: getCategoryColor(product.category) }}
                  >
                    {product.category}
                  </span>
                </div>
                <div className="product-stats">
                  <div className="stat-item">
                    <span className="stat-label">Price</span>
                    <span className="stat-value">Rs {product.price.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Sales</span>
                    <span className="stat-value">{product.sales.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Revenue</span>
                    <span className="stat-value">Rs {product.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="product-footer">
                  <div className={`product-trend ${product.trendDirection}`}>
                    {product.trendDirection === 'up' ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    <span>{product.trend}</span>
                  </div>
                  <div className="product-stock">
                    <span className={`stock-status ${product.stock < 25 ? 'critical' : product.stock < 50 ? 'low' : 'medium'}`}>
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Sales</th>
                <th>Revenue</th>
                <th>Trend</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product, index) => (
                <tr key={product.id}>
                  <td>
                    <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                  </td>
                  <td>
                    <div className="product-cell">
                      <img src={product.image} alt={product.name} className="product-thumb" />
                      <span className="product-name">{product.name}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: `${getCategoryColor(product.category)}20`, color: getCategoryColor(product.category) }}
                    >
                      {product.category}
                    </span>
                  </td>
                  <td className="price-cell">Rs {product.price.toLocaleString()}</td>
                  <td>{product.sales.toLocaleString()}</td>
                  <td className="revenue-cell">Rs {product.revenue.toLocaleString()}</td>
                  <td>
                    <span className={`trend-badge ${product.trendDirection}`}>
                      {product.trendDirection === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {product.trend}
                    </span>
                  </td>
                  <td>
                    <span className={`stock-badge ${product.stock < 25 ? 'critical' : product.stock < 50 ? 'low' : 'medium'}`}>
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopProducts;

