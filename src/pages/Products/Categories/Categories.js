import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, Eye, MoreHorizontal,
  ChevronRight, Folder, FolderOpen, Image, Grid, X
} from 'lucide-react';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', slug: 'electronics', icon: '💻', color: '#3b82f6', products: 234, subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Accessories'], image: 'https://via.placeholder.com/100x100/3b82f6/ffffff?text=Elec' },
    { id: 2, name: 'Audio', slug: 'audio', icon: '🎧', color: '#8b5cf6', products: 156, subcategories: ['Headphones', 'Speakers', 'Earbuds'], image: 'https://via.placeholder.com/100x100/8b5cf6/ffffff?text=Audio' },
    { id: 3, name: 'Wearables', slug: 'wearables', icon: '⌚', color: '#10b981', products: 89, subcategories: ['Smartwatches', 'Fitness Trackers'], image: 'https://via.placeholder.com/100x100/10b981/ffffff?text=Wear' },
    { id: 4, name: 'Gaming', slug: 'gaming', icon: '🎮', color: '#ec4899', products: 167, subcategories: ['Consoles', 'Games', 'Accessories'], image: 'https://via.placeholder.com/100x100/ec4899/ffffff?text=Game' },
    { id: 5, name: 'Cameras', slug: 'cameras', icon: '📷', color: '#f59e0b', products: 78, subcategories: ['DSLR', 'Mirrorless', 'Action Cams'], image: 'https://via.placeholder.com/100x100/f59e0b/ffffff?text=Cam' },
    { id: 6, name: 'Accessories', slug: 'accessories', icon: '🔌', color: '#6b7280', products: 312, subcategories: ['Cables', 'Chargers', 'Cases'], image: 'https://via.placeholder.com/100x100/6b7280/ffffff?text=Acc' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: '#3b82f6',
    icon: '📁',
    subcategories: ''
  });

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (formData.name && formData.slug) {
      if (editingCategory) {
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, ...formData, subcategories: formData.subcategories.split(',').map(s => s.trim()).filter(Boolean) }
            : cat
        ));
      } else {
        setCategories([...categories, {
          ...formData,
          id: Date.now(),
          products: 0,
          subcategories: formData.subcategories.split(',').map(s => s.trim()).filter(Boolean),
          image: `https://via.placeholder.com/100x100/${formData.color.replace('#', '')}/ffffff?text=${formData.name.substring(0, 3)}`
        }]);
      }
      closeModal();
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      color: category.color,
      icon: category.icon,
      subcategories: category.subcategories.join(', ')
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', color: '#3b82f6', icon: '📁', subcategories: '' });
  };

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
            <div key={category.id} className="category-card card-hover">
              <div className="category-image" style={{ backgroundColor: category.color + '20' }}>
                <img src={category.image} alt={category.name} />
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
                    {category.products} products
                  </span>
                </div>

                {expandedCategories.includes(category.id) && (
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
                    onClick={() => toggleExpand(category.id)}
                  >
                    {expandedCategories.includes(category.id) ? 'Hide' : 'Show'} Subcategories
                  </button>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Edit" onClick={() => handleEdit(category)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon" title="Delete" onClick={() => handleDelete(category.id)}>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map(category => (
                <tr key={category.id}>
                  <td>
                    <div className="category-cell">
                      <img src={category.image} alt={category.name} className="category-thumb" />
                      <span className="category-icon-small">{category.icon}</span>
                      <span className="category-name-text">{category.name}</span>
                    </div>
                  </td>
                  <td><code className="category-slug-text">/{category.slug}</code></td>
                  <td>{category.subcategories.length}</td>
                  <td>{category.products}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Edit" onClick={() => handleEdit(category)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon" title="Delete" onClick={() => handleDelete(category.id)}>
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
                <label className="form-label">Subcategories (comma-separated)</label>
                <textarea
                  placeholder="Subcategory 1, Subcategory 2, Subcategory 3"
                  value={formData.subcategories}
                  onChange={(e) => setFormData({ ...formData, subcategories: e.target.value })}
                  className="form-input textarea"
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button onClick={handleSubmit} className="btn btn-primary">
                  {editingCategory ? 'Update Category' : 'Add Category'}
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

