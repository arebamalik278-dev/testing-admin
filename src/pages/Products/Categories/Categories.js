import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, Eye,
  ChevronRight, Folder, Image, Grid, X
} from 'lucide-react';
import './Categories.css';
import api from '../../../api/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: '#3b82f6',
    icon: '📁',
    subcategories: '',
    description: '',
    isActive: true
  });

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/categories/admin/all');
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoryData = {
        ...formData,
        subcategories: formData.subcategories.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingCategory) {
        // Update existing category
        const response = await api.put(`/categories/${editingCategory._id}`, categoryData);
        if (response.success) {
          setCategories(categories.map(cat => 
            cat._id === editingCategory._id ? response.data : cat
          ));
        }
      } else {
        // Create new category
        const response = await api.post('/categories', categoryData);
        if (response.success) {
          setCategories([...categories, response.data]);
        }
      }
      
      closeModal();
    } catch (err) {
      console.error('Error saving category:', err);
      setError(err.message || 'Failed to save category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      color: category.color,
      icon: category.icon,
      subcategories: category.subcategories.join(', '),
      description: category.description || '',
      isActive: category.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        setLoading(true);
        setError(null);
        const response = await api.delete(`/categories/${id}`);
        if (response.success) {
          setCategories(categories.filter(cat => cat._id !== id));
        }
      } catch (err) {
        console.error('Error deleting category:', err);
        setError(err.message || 'Failed to delete category. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleCategoryStatus = async (category) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.patch(`/categories/${category._id}/toggle`);
      if (response.success) {
        setCategories(categories.map(cat => 
          cat._id === category._id ? response.data : cat
        ));
      }
    } catch (err) {
      console.error('Error toggling category status:', err);
      setError(err.message || 'Failed to toggle category status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ 
      name: '', 
      slug: '', 
      color: '#3b82f6', 
      icon: '📁', 
      subcategories: '',
      description: '',
      isActive: true
    });
  };

  if (loading && categories.length === 0) {
    return (
      <div className="categories-page animate-fade-in">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Manage your product categories and subcategories.</p>
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
            Add Category
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

      <div className="categories-search">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="categories-grid">
          {filteredCategories.map(category => (
            <div key={category._id} className="category-card card-hover">
              <div className="category-image" style={{ backgroundColor: category.color + '20' }}>
                <img 
                  src={`https://via.placeholder.com/100x100/${category.color.replace('#', '')}/ffffff?text=${category.name.substring(0, 3)}`} 
                  alt={category.name} 
                />
                <span className="category-icon">{category.icon}</span>
              </div>
              
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-slug">/{category.slug}</p>
                <div className="category-stats">
                  <span className="stat">
                    <Folder size={14} />
                    {category.subcategories.length} subcategories
                  </span>
                  <span className="stat">
                    <Image size={14} />
                    {category.products || 0} products
                  </span>
                </div>

                {category.description && (
                  <p className="category-description">{category.description}</p>
                )}

                {expandedCategories.includes(category._id) && (
                  <div className="subcategories-list">
                    {category.subcategories.map((sub, idx) => (
                      <div key={idx} className="subcategory-item">
                        <ChevronRight size={12} />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="category-actions">
                  <button 
                    className="btn-text"
                    onClick={() => toggleExpand(category._id)}
                  >
                    {expandedCategories.includes(category._id) ? 'Hide' : 'Show'} Subcategories
                  </button>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon" 
                      title={category.isActive ? "Deactivate" : "Activate"}
                      onClick={() => toggleCategoryStatus(category)}
                    >
                      <Eye size={16} style={{ color: category.isActive ? '#10b981' : '#6b7280' }} />
                    </button>
                    <button className="btn-icon" title="Edit" onClick={() => handleEdit(category)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon" title="Delete" onClick={() => handleDelete(category._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="categories-list">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Subcategories</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(category => (
                <tr key={category._id}>
                  <td>
                    <div className="category-cell">
                      <img 
                        src={`https://via.placeholder.com/100x100/${category.color.replace('#', '')}/ffffff?text=${category.name.substring(0, 3)}`} 
                        alt={category.name} 
                        className="category-thumb" 
                      />
                      <span className="category-icon-small">{category.icon}</span>
                      <span className="category-name-text">{category.name}</span>
                    </div>
                  </td>
                  <td><code className="category-slug-text">/{category.slug}</code></td>
                  <td>{category.subcategories.length}</td>
                  <td>{category.products || 0}</td>
                  <td>
                    <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        title={category.isActive ? "Deactivate" : "Activate"}
                        onClick={() => toggleCategoryStatus(category)}
                      >
                        <Eye size={16} style={{ color: category.isActive ? '#10b981' : '#6b7280' }} />
                      </button>
                      <button className="btn-icon" title="Edit" onClick={() => handleEdit(category)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon" title="Delete" onClick={() => handleDelete(category._id)}>
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
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name"
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
                  placeholder="category-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="form-input color-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Icon (Emoji)</label>
                  <input
                    type="text"
                    placeholder="📁"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Category description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input textarea"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subcategories (comma-separated)</label>
                <textarea
                  placeholder="Subcategory 1, Subcategory 2, Subcategory 3"
                  value={formData.subcategories}
                  onChange={(e) => setFormData({ ...formData, subcategories: e.target.value })}
                  className="form-input textarea"
                  rows={3}
                />
              </div>

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
                    editingCategory ? 'Update Category' : 'Add Category'
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

export default Categories;
