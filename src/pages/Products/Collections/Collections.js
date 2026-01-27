import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Edit, Trash2, Eye,
  ChevronRight, Folder, Image, Grid, X
} from 'lucide-react';
import './Collections.css';
import api from '../../../api/api';
import socketService from '../../../services/socketService';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [expandedCollections, setExpandedCollections] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Collection',
    isActive: true,
    isFeatured: false,
    products: []
  });

  // Fetch collections and available products
  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      const [collectionsResponse, productsResponse] = await Promise.all([
        api.get('/collections/admin/all'),
        api.get('/products/admin/all')
      ]);
      
      if (collectionsResponse.success) {
        setCollections(collectionsResponse.data);
      }
      
      if (productsResponse.success && productsResponse.data && productsResponse.data.data) {
        setAvailableProducts(productsResponse.data.data);
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err.message || 'Failed to fetch collections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();

    // Connect to socket and listen for real-time updates
    const connectSocket = async () => {
      try {
        await socketService.connect();
        
        // Listen for collection updates
        socketService.on('COLLECTION_CREATED', (newCollection) => {
          setCollections(prev => [...prev, newCollection]);
        });

        socketService.on('COLLECTION_UPDATED', (updatedCollection) => {
          setCollections(prev => 
            prev.map(col => col._id === updatedCollection._id ? updatedCollection : col)
          );
        });

        socketService.on('COLLECTION_DELETED', (deletedCollection) => {
          setCollections(prev => 
            prev.filter(col => col._id !== deletedCollection._id)
          );
        });
      } catch (error) {
        console.error('Failed to connect to socket:', error);
      }
    };

    connectSocket();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const filteredCollections = collections.filter(col =>
    col.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    col.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedCollections(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const collectionData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-')
      };

      if (editingCollection) {
        // Update existing collection
        const response = await api.put(`/collections/${editingCollection._id}`, collectionData);
        if (response.success) {
          setCollections(collections.map(col =>
            col._id === editingCollection._id ? response.data : col
          ));
        }
      } else {
        // Create new collection
        const response = await api.post('/collections', collectionData);
        if (response.success) {
          setCollections([...collections, response.data]);
        }
      }
      
      closeModal();
    } catch (err) {
      console.error('Error saving collection:', err);
      setError(err.message || 'Failed to save collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || '',
      image: collection.image,
      isActive: collection.isActive,
      isFeatured: collection.isFeatured || false,
      products: collection.products.map(p => p._id || p)
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        setLoading(true);
        setError(null);
        const response = await api.delete(`/collections/${id}`);
        if (response.success) {
          setCollections(collections.filter(col => col._id !== id));
        }
      } catch (err) {
        console.error('Error deleting collection:', err);
        setError(err.message || 'Failed to delete collection. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleCollectionStatus = async (collection) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/collections/${collection._id}`, {
        ...collection,
        isActive: !collection.isActive
      });
      if (response.success) {
        setCollections(collections.map(col =>
          col._id === collection._id ? response.data : col
        ));
      }
    } catch (err) {
      console.error('Error toggling collection status:', err);
      setError(err.message || 'Failed to toggle collection status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductToggle = (productId) => {
    setFormData(prev => {
      const isProductSelected = prev.products.includes(productId);
      return {
        ...prev,
        products: isProductSelected
          ? prev.products.filter(id => id !== productId)
          : [...prev.products, productId]
      };
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCollection(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://via.placeholder.com/300x200/6b7280/ffffff?text=Collection',
      isActive: true,
      isFeatured: false,
      products: []
    });
  };

  if (loading && collections.length === 0) {
    return (
      <div className="collections-page animate-fade-in">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="collections-page animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Collections</h1>
          <p className="page-subtitle">Manage your product collections and groups.</p>
        </div>
        <div className="page-actions">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <Folder size={18} />
            </button>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} />
            Add Collection
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button className="error-close" onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="collections-search">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="collections-grid">
          {filteredCollections.map(collection => (
            <div key={collection._id} className="collection-card card-hover">
              <div className="collection-image">
                <img
                  src={collection.image}
                  alt={collection.name}
                />
              </div>

              <div className="collection-content">
                <h3 className="collection-name">{collection.name}</h3>
                <p className="collection-slug">/{collection.slug}</p>
                <div className="collection-stats">
                  <span className="stat">
                    <Image size={14} />
                    {collection.productCount || collection.products.length} products
                  </span>
                  <span className="stat">
                    {collection.isFeatured ? 'Featured' : 'Normal'}
                  </span>
                </div>

                {collection.description && (
                  <p className="collection-description">{collection.description}</p>
                )}

                {expandedCollections.includes(collection._id) && (
                  <div className="products-list">
                    {collection.products.slice(0, 3).map((product) => (
                      <div key={product._id || product} className="product-item">
                        <ChevronRight size={12} />
                        <span>{typeof product === 'string' ? 'Product' : product.name}</span>
                      </div>
                    ))}
                    {collection.products.length > 3 && (
                      <div className="more-products">
                        +{collection.products.length - 3} more products
                      </div>
                    )}
                  </div>
                )}

                <div className="collection-actions">
                  <button
                    className="btn-text"
                    onClick={() => toggleExpand(collection._id)}
                  >
                    {expandedCollections.includes(collection._id) ? 'Hide' : 'Show'} Products
                  </button>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      title={collection.isActive ? "Deactivate" : "Activate"}
                      onClick={() => toggleCollectionStatus(collection)}
                    >
                      <Eye size={16} style={{ color: collection.isActive ? '#10b981' : '#6b7280' }} />
                    </button>
                    <button className="btn-icon" title="Edit" onClick={() => handleEdit(collection)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon" title="Delete" onClick={() => handleDelete(collection._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="collections-list">
          <table>
            <thead>
              <tr>
                <th>Collection</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCollections.map(collection => (
                <tr key={collection._id}>
                  <td>
                    <div className="collection-cell">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="collection-thumb"
                      />
                      <span className="collection-name-text">{collection.name}</span>
                    </div>
                  </td>
                  <td><code className="collection-slug-text">/{collection.slug}</code></td>
                  <td>{collection.productCount || collection.products.length}</td>
                  <td>
                    <span className={`status-badge ${collection.isActive ? 'active' : 'inactive'}`}>
                      {collection.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${collection.isFeatured ? 'active' : 'inactive'}`}>
                      {collection.isFeatured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        title={collection.isActive ? "Deactivate" : "Activate"}
                        onClick={() => toggleCollectionStatus(collection)}
                      >
                        <Eye size={16} style={{ color: collection.isActive ? '#10b981' : '#6b7280' }} />
                      </button>
                      <button className="btn-icon" title="Edit" onClick={() => handleEdit(collection)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon" title="Delete" onClick={() => handleDelete(collection._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCollection ? 'Edit Collection' : 'Add New Collection'}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Collection Name</label>
                <input
                  type="text"
                  placeholder="Enter collection name"
                  value={formData.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                  })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  placeholder="collection-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Collection description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input textarea"
                  rows={3}
                />
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

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    value={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="form-input"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Featured</label>
                  <select
                    value={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value === 'true' })}
                    className="form-input"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Products</label>
                <div className="products-selector">
                  {availableProducts.map(product => (
                    <label key={product._id} className="product-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.products.includes(product._id)}
                        onChange={() => handleProductToggle(product._id)}
                      />
                      <span className="product-name">{product.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-small"></div>
                      Saving...
                    </>
                  ) : (
                    editingCollection ? 'Update Collection' : 'Add Collection'
                  )}
                </button>
                <button onClick={closeModal} className="btn btn-secondary">
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

export default Collections;
