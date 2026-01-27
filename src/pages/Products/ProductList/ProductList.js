import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Eye, Edit, Trash2, Filter, Download,
  MoreHorizontal, ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle
} from 'lucide-react';
import api from '../../../api/api';
import socketService from '../../../services/socketService';

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
  const [categories, setCategories] = useState([]);

  // Load products and categories from backend
  useEffect(() => {
    fetchProducts();
    fetchCategories();

    // Connect to socket and listen for real-time updates
    const connectSocket = async () => {
      try {
        await socketService.connect();
        
        // Listen for product updates
        socketService.on('PRODUCT_UPDATED', (updatedProduct) => {
          setProducts(prevProducts => 
            prevProducts.map(product => {
              if (product.id === updatedProduct._id) {
                return {
                  ...product,
                  name: updatedProduct.name,
                  category: updatedProduct.category?.name || updatedProduct.category || 'Uncategorized',
                  price: updatedProduct.price,
                  stock: updatedProduct.stock,
                  status: updatedProduct.stock < 50 ? 'low' : 'active',
                  image: updatedProduct.images?.[0]?.url || product.image
                };
              }
              return product;
            })
          );
        });

        // Listen for product deletions
        socketService.on('PRODUCT_DELETED', (deletedProduct) => {
          setProducts(prevProducts => 
            prevProducts.filter(product => product.id !== deletedProduct._id)
          );
        });

        // Listen for product creations
        socketService.on('PRODUCT_CREATED', (newProduct) => {
          setProducts(prevProducts => [
            ...prevProducts,
            {
              id: newProduct._id,
              name: newProduct.name,
              sku: newProduct.sku || `SKU-${newProduct._id.substring(0, 6)}`,
              category: newProduct.category?.name || newProduct.category || 'Uncategorized',
              price: newProduct.price,
              stock: newProduct.stock,
              status: newProduct.stock < 50 ? 'low' : 'active',
              image: newProduct.images?.[0]?.url || 'https://via.placeholder.com/300x300/6b7280/ffffff?text=Product'
            }
          ]);
        });
      } catch (error) {
        console.error('Failed to connect to socket:', error);
      }
    };

    connectSocket();

    // Cleanup
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.success && response.data) {
        // Extract category names from category objects
        const categoryNames = response.data.map(category => category.name);
        setCategories(categoryNames);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Fallback to default categories if API fails
      setCategories(['Electronics', 'Audio', 'Wearables', 'Tablets', 'Gaming', 'Accessories']);
    }
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/admin/all');
      if (response.success && response.data) {
        // Transform backend data to match frontend format
        const transformedProducts = response.data.map(p => ({
          id: p._id,
          name: p.name,
          sku: p.sku || `SKU-${p._id.substring(0, 6)}`,
          category: p.category?.name || p.category || 'Uncategorized',
          price: p.price,
          stock: p.stock,
          status: p.stock < 50 ? 'low' : 'active',
          image: p.images?.[0]?.url || 'https://via.placeholder.com/300x300/6b7280/ffffff?text=Product'
        }));
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showMessage('error', 'Failed to load products: ' + error.message);
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
        const response = await api.put(`/products/${editingProduct.id}`, {
          name: formData.name,
          sku: formData.sku,
          category: formData.category,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: formData.image ? [{ url: formData.image, alt: `${formData.name} image` }] : []
        });

        if (response.success) {
          const updatedProducts = products.map(p => 
            p.id === editingProduct.id ? { 
              ...p, 
              ...formData, 
              price: parseFloat(formData.price), 
              stock: parseInt(formData.stock)
            } : p
          );
          setProducts(updatedProducts);
          showMessage('success', 'Product updated successfully');
        }
      } else {
        // Add new product
        const response = await api.post('/products', {
          name: formData.name,
          sku: formData.sku,
          category: formData.category,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: formData.image ? [{ url: formData.image, alt: `${formData.name} image` }] : [],
          description: `${formData.name} is a high quality product`,
          brand: 'Generic',
          specifications: [],
          tags: [formData.category.toLowerCase()],
          isFeatured: false
        });

        if (response.success) {
          const newProduct = {
            id: response.data._id,
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            image: formData.image || 'https://via.placeholder.com/60x60/6b7280/ffffff?text=Product'
          };
          setProducts([...products, newProduct]);
          showMessage('success', 'Product added successfully');
        }
      }
      closeModal();
    } catch (error) {
      showMessage('error', 'Error saving product: ' + error.message);
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
      const response = await api.delete(`/products/${productToDelete.id}`);
      if (response.success) {
        const updatedProducts = products.filter(p => p.id !== productToDelete.id);
        setProducts(updatedProducts);
        showMessage('success', 'Product deleted successfully');
      }
    } catch (error) {
      showMessage('error', 'Error deleting product: ' + error.message);
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
    setFormData({ name: '', sku: '', category: '', price: '', stock: '', status: 'active', image: 'https://via.placeholder.com/300x300/6b7280/ffffff?text=Product' });
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
      image: 'https://via.placeholder.com/300x300/6b7280/ffffff?text=Product' 
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
          <p className="page-subtitle">{products.length} products • Live database</p>
        </div>
        <div className="page-actions">
          <button onClick={fetchProducts} className="btn btn-secondary" disabled={loading}>
            <Download size={16} />
            Refresh
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
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price *</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input
                    type="number"
                    placeholder="Enter stock"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  placeholder="Enter image URL"
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
                  {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Delete</h3>
              <button onClick={() => setShowConfirm(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete {productToDelete?.name}?</p>
              <p className="text-danger">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowConfirm(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-danger" disabled={loading}>
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
