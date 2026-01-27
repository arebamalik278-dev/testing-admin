import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Star, Download, Search, 
  Grid, List, Loader, Package
} from 'lucide-react';
import api from '../../../api/api';
import './TopProducts.css';

const TopProducts = () => {
  const [sortBy, setSortBy] = useState('revenue');
  const [timeRange, setTimeRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch top products from API
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/dashboard/top-products?limit=10');
        // Transform API response to match frontend structure
        const transformedProducts = response.data.map((item, index) => ({
          id: item.product?._id || `temp-${index}`,
          name: item.product?.name || 'Unknown Product',
          sku: item.product?.sku || 'N/A',
          category: item.product?.category || 'Uncategorized',
          image: item.product?.images?.[0]?.url || 'https://via.placeholder.com/80x80/3b82f6/ffffff?text=Product',
          price: item.product?.price || 0,
          sales: item.sales || 0,
          revenue: item.revenue || 0,
          trend: '+0%',
          trendDirection: 'up',
          rating: item.product?.ratings?.average || 0,
          reviews: item.product?.ratings?.count || 0,
          stock: item.product?.stock || 0,
          status: (item.product?.stock || 0) < 25 ? 'low' : 'active'
        }));
        setProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching top products:', err);
        setError('Failed to load top products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [timeRange]);

  const filteredProducts = products.filter(product =>
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

  // Calculate trend data based on sorted position
  const getProductTrend = (index, totalProducts) => {
    if (totalProducts <= 1) return { trend: '+0%', trendDirection: 'up' };
    if (index < totalProducts / 3) return { trend: '+15%', trendDirection: 'up' };
    if (index < totalProducts * 2 / 3) return { trend: '+5%', trendDirection: 'up' };
    return { trend: '-2%', trendDirection: 'down' };
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

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <Loader size={40} className="loading-spinner" />
          <p>Loading top products...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="empty-container">
          <Package size={48} className="empty-icon" />
          <p className="empty-message">No products found</p>
          <p className="empty-subtitle">Start selling to see your top products here</p>
        </div>
      )}

      {/* Top Products Grid */}
      {!loading && !error && products.length > 0 && viewMode === 'grid' && (
        <div className="products-grid">
          {sortedProducts.map((product, index) => {
            const { trend, trendDirection } = getProductTrend(index, sortedProducts.length);
            return (
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
                    <div className={`product-trend ${trendDirection}`}>
                      {trendDirection === 'up' ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      <span>{trend}</span>
                    </div>
                    <div className="product-stock">
                      <span className={`stock-status ${product.stock < 25 ? 'critical' : product.stock < 50 ? 'low' : 'medium'}`}>
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Top Products Table */}
      {!loading && !error && products.length > 0 && viewMode === 'table' && (
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
              {sortedProducts.map((product, index) => {
                const { trend, trendDirection } = getProductTrend(index, sortedProducts.length);
                return (
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
                      <span className={`trend-badge ${trendDirection}`}>
                        {trendDirection === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {trend}
                      </span>
                    </td>
                    <td>
                      <span className={`stock-badge ${product.stock < 25 ? 'critical' : product.stock < 50 ? 'low' : 'medium'}`}>
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopProducts;
