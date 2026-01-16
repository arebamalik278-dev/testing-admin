import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Search, Eye, Edit, Trash2, Filter, Download,
  MoreHorizontal, ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle
} from 'lucide-react';

// API Configuration - Points to Vercel backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://backendtestin.vercel.app/api';

// Helper function to get admin token
const getAdminToken = () => {
  return localStorage.getItem('adminToken') || '';
};

// API helper with auth
const apiWithAuth = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAdminToken()}`
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Network response was not ok');
    }
    return await response.json();
  },
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAdminToken()}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Network response was not ok');
    }
    return await response.json();
  },
  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAdminToken()}`
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Network response was not ok');
    }
    return await response.json();
  },
  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAdminToken()}`
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Network response was not ok');
    }
    return await response.json();
  }
};

// Default products for new installs
const defaultProducts = [
  { id: '1', name: 'iPhone 15 Pro', sku: 'IPP-001', category: 'Electronics', price: 279999, stock: 234, status: 'active', image: 'https://via.placeholder.com/60x60/3b82f6/ffffff?text=iPhone' },
  { id: '2', name: 'MacBook Air M3', sku: 'MBA-002', category: 'Electronics', price: 309999, stock: 156, status: 'active', image: 'https://via.placeholder.com/60x60/10b981/ffffff?text=MacBook' },
  { id: '3', name: 'AirPods Pro 2', sku: 'APP-003', category: 'Audio', price: 69999, stock: 432, status: 'active', image: 'https://via.placeholder.com/60x60/8b5cf6/ffffff?text=AirPods' },
  { id: '4', name: 'Apple Watch Ultra', sku: 'AWU-004', category: 'Wearables', price: 224999, stock: 89, status: 'low', image: 'https://via.placeholder.com/60x60/f59e0b/ffffff?text=Watch' },
  { id: '5', name: 'iPad Pro 12.9"', sku: 'IPP-005', category: 'Tablets', price: 309999, stock: 123, status: 'active', image: 'https://via.placeholder.com/60x60/ef4444/ffffff?text=iPad' },
  { id: '6', name: 'Samsung Galaxy S24', sku: 'SGS-006', category: 'Electronics', price: 239999, stock: 267, status: 'active', image: 'https://via.placeholder.com/60x60/06b6d4/ffffff?text=Galaxy' },
  { id: '7', name: 'Sony WH-1000XM5', sku: 'SWH-007', category: 'Audio', price: 98999, stock: 178, status: 'active', image: 'https://via.placeholder.com/60x60/6366f1/ffffff?text=Sony' },
  { id: '8', name: 'Nintendo Switch OLED', sku: 'NSO-008', category: 'Gaming', price: 98999, stock: 45, status: 'low', image: 'https://via.placeholder.com/60x60/ec4899/ffffff?text=Switch' }
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', price: '', stock: '', status: 'active', image: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const itemsPerPage = 10;
  const categories = ['Electronics', 'Audio', 'Wearables', 'Tablets', 'Gaming', 'Accessories'];

  // Load products from localStorage or use defaults
  useEffect(() => {
    const loadProducts = () => {
      const storedProducts = localStorage.getItem('adminProducts');
      if (storedProducts) {
        try {
          setProducts(JSON.parse(storedProducts));
        } catch (e) {
          setProducts(defaultProducts);
          localStorage.setItem('adminProducts', JSON.stringify(defaultProducts));
        }
      } else {
        setProducts(defaultProducts);
        localStorage.setItem('adminProducts', JSON.stringify(defaultProducts));
      }
    };
    loadProducts();
  }, []);

  // Save products to localStorage whenever they change
  const saveProductsToStorage = useCallback((updatedProducts) => {
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    // Also update client products so both sides see same data
    localStorage.setItem('clientProducts', JSON.stringify(updatedProducts));
  }, []);

  // Fetch products from backend (alternative to localStorage)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiWithAuth.get('/products');
      if (data && data.length > 0) {
        // Transform backend data to match frontend format
        const transformedProducts = data.map(p => ({
          id: p._id || p.id,
          name: p.name,
          sku: p.sku || `SKU-${(p._id || p.id).substring(0, 6)}`,
          category: p.category,
          price: p.price,
          stock: p.stock,
          status: p.stock < 50 ? 'low' : 'active',
          image: p.imageURL || p.image || 'https://via.placeholder.com/60x60/6b7280/ffffff?text=Product'
        }));
        setProducts(transformedProducts);
        saveProductsToStorage(transformedProducts);
      }
    } catch (error) {
      console.warn('Backend not available, using localStorage:', error.message);
      // Keep using localStorage data
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.sku) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id ? { ...p, ...formData } : p
        );
        setProducts(updatedProducts);
        saveProductsToStorage(updatedProducts);
        
        // Try backend update
        try {
          await apiWithAuth.put(`/products/${editingProduct.id}`, {
            name: formData.name,
            sku: formData.sku,
            category: formData.category,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            imageURL: formData.image
          });
        } catch (e) {
          console.warn('Backend update failed, using localStorage only');
        }
        
        showMessage('success', 'Product updated successfully');
      } else {
        // Add new product
        const newProduct = {
          id: Date.now().toString(),
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        };
        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);
        saveProductsToStorage(updatedProducts);
        
        // Try backend create
        try {
          await apiWithAuth.post('/products', {
            name: formData.name,
            sku: formData.sku,
            category: formData.category,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            imageURL: formData.image
          });
        } catch (e) {
          console.warn('Backend create failed, using localStorage only');
        }
        
        showMessage('success', 'Product added successfully');
      }
      closeModal();
    } catch (error) {
      showMessage('error', 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setLoading(true);
    try {
      // Update local state
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      setProducts(updatedProducts);
      saveProductsToStorage(updatedProducts);
      
      // Try backend delete
      try {
        await apiWithAuth.delete(`/products/${productToDelete.id}`);
      } catch (e) {
        console.warn('Backend delete failed, using localStorage only');
      }
      
      showMessage('success', 'Product deleted successfully');
    } catch (error) {
      showMessage('error', 'Error deleting product');
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
      image: product.image
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', sku: '', category: '', price: '', stock: '', status: 'active', image: 'https://via.placeholder.com/60x60/6b7280/ffffff?text=Product' });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ 
      name: '', 
      sku: '', 
      category: '', 
      price: '', 
      stock: '', 
      status: 'active', 
      image: 'https://via.placeholder.com/60x60/6b7280/ffffff?text=Product' 
    });
    setShowModal(true);
  };

  const getStockStatus = (stock) => {
    if (stock < 50) return 'stock-low';
    if (stock < 150) return 'stock-medium';
    return 'stock-high';
  };

  return (
    <div className="product-list-container">
      {/* Message Toast */}
      {message.text && (
        <div className={`toast-message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <div className="page-header">
        <div className="page-header-left">
          <h2 className="page-title">Product List</h2>
          <p className="page-subtitle">{products.length} products • Synced with client</p>
        </div>
        <div className="page-actions">
          <button onClick={fetchProducts} className="btn btn-secondary" disabled={loading}>
            <Download size={16} />
            Sync Backend
          </button>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="low">Low Stock</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-container">
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-info">
                      <img src={product.image} alt={product.name} className="product-thumbnail" />
                      <span className="product-name">{product.name}</span>
                    </div>
                  </td>
                  <td className="text-gray">{product.sku}</td>
                  <td>{product.category}</td>
                  <td className="product-price">Rs {product.price.toLocaleString()}</td>
                  <td>
                    <span className={`stock-badge ${getStockStatus(product.stock)}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${product.status}`}>
                      {product.status === 'active' ? 'Active' : product.status === 'low' ? 'Low Stock' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(product)} className="btn-icon btn-edit" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteClick(product)} className="btn-icon btn-delete" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={closeModal} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">SKU *</label>
                  <input
                    type="text"
                    placeholder="Enter SKU"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (Rs) *</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-input"
                >
                  <option value="active">Active</option>
                  <option value="low">Low Stock</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Delete</h3>
              <button onClick={() => setShowConfirm(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>?</p>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowConfirm(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-danger" disabled={loading}>
                {loading ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

