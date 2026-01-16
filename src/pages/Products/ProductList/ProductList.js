import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Eye, Edit, Trash2, Filter, Download,
  MoreHorizontal, ChevronLeft, ChevronRight
} from 'lucide-react';
import api from '../../../api/api';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'iPhone 15 Pro', sku: 'IPP-001', category: 'Electronics', price: 279999, stock: 234, status: 'active', image: 'https://via.placeholder.com/60x60/3b82f6/ffffff?text=iPhone' },
    { id: 2, name: 'MacBook Air M3', sku: 'MBA-002', category: 'Electronics', price: 309999, stock: 156, status: 'active', image: 'https://via.placeholder.com/60x60/10b981/ffffff?text=MacBook' },
    { id: 3, name: 'AirPods Pro 2', sku: 'APP-003', category: 'Audio', price: 69999, stock: 432, status: 'active', image: 'https://via.placeholder.com/60x60/8b5cf6/ffffff?text=AirPods' },
    { id: 4, name: 'Apple Watch Ultra', sku: 'AWU-004', category: 'Wearables', price: 224999, stock: 89, status: 'low', image: 'https://via.placeholder.com/60x60/f59e0b/ffffff?text=Watch' },
    { id: 5, name: 'iPad Pro 12.9"', sku: 'IPP-005', category: 'Tablets', price: 309999, stock: 123, status: 'active', image: 'https://via.placeholder.com/60x60/ef4444/ffffff?text=iPad' },
    { id: 6, name: 'Samsung Galaxy S24', sku: 'SGS-006', category: 'Electronics', price: 239999, stock: 267, status: 'active', image: 'https://via.placeholder.com/60x60/06b6d4/ffffff?text=Galaxy' },
    { id: 7, name: 'Sony WH-1000XM5', sku: 'SWH-007', category: 'Audio', price: 98999, stock: 178, status: 'active', image: 'https://via.placeholder.com/60x60/6366f1/ffffff?text=Sony' },
    { id: 8, name: 'Nintendo Switch OLED', sku: 'NSO-008', category: 'Gaming', price: 98999, stock: 45, status: 'low', image: 'https://via.placeholder.com/60x60/ec4899/ffffff?text=Switch' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', price: '', stock: '', status: 'active', image: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = ['Electronics', 'Audio', 'Wearables', 'Tablets', 'Gaming', 'Accessories'];

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        // const data = await api.get('/api/products');
        // setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async () => {
    if (formData.name && formData.sku) {
      try {
        if (editingProduct) {
          // await api.put(`/api/products/${editingProduct.id}`, formData);
          setProducts(products.map(p => 
            p.id === editingProduct.id ? { ...p, ...formData } : p
          ));
        } else {
          // const newProduct = await api.post('/api/products', formData);
          setProducts([...products, { ...formData, id: products.length + 1 }]);
        }
        closeModal();
      } catch (error) {
        console.error('Error saving product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      image: product.image
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // await api.delete(`/api/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', sku: '', category: '', price: '', stock: '', status: 'active', image: '' });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', sku: '', category: '', price: '', stock: '', status: 'active', image: 'https://via.placeholder.com/60x60/6b7280/ffffff?text=Product' });
    setShowModal(true);
  };

  const getStockStatus = (stock) => {
    if (stock < 50) return 'stock-low';
    if (stock < 150) return 'stock-medium';
    return 'stock-high';
  };

  return (
    <div className="product-list-container">
      <div className="page-header">
        <h2 className="page-title">Product List</h2>
        <button onClick={openAddModal} className="btn-primary">
          <Plus size={20} />
          Add Product
        </button>
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

          <button className="btn-secondary">
            <Download size={18} />
            Export
          </button>
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
              {paginatedProducts.map((product) => (
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
                      <button className="btn-icon btn-view" title="View">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleEdit(product)} className="btn-icon btn-edit" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="btn-icon btn-delete" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Product Name</label>
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
                  <label className="form-label">SKU</label>
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
                  <label className="form-label">Price (Rs)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
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

              <div className="modal-actions">
                <button onClick={handleSubmit} className="btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

