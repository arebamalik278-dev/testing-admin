import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MoveUp, MoveDown } from 'lucide-react';
import api from '../../../api/api';
import './BannersCarousels.css';

const BannersCarousels = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    cta: 'Shop Now',
    isActive: true
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await api.get('/banners');
      setBanners(data.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setError('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (formData.title && formData.image) {
      try {
        if (editingBanner) {
          const data = await api.put(`/banners/${editingBanner._id}`, formData);
          setBanners(banners.map(banner => 
            banner._id === editingBanner._id 
              ? data.data 
              : banner
          ));
        } else {
          const data = await api.post('/banners', formData);
          setBanners([...banners, data.data]);
        }
        
        closeModal();
      } catch (error) {
        console.error('Error saving banner:', error);
        alert('Failed to save banner: ' + error.message);
      }
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      link: banner.link || '/',
      cta: banner.cta || 'Shop Now',
      isActive: banner.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await api.delete(`/banners/${id}`);
        setBanners(banners.filter(banner => banner._id !== id));
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Failed to delete banner: ' + error.message);
      }
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const data = await api.patch(`/banners/${banner._id}/toggle`, {});
      setBanners(banners.map(b => 
        b._id === banner._id ? data.data : b
      ));
    } catch (error) {
      console.error('Error toggling banner:', error);
      alert('Failed to toggle banner: ' + error.message);
    }
  };

  const moveUp = async (index) => {
    if (index > 0) {
      const newBanners = [...banners];
      [newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]];
      
      // Update order on server
      try {
        const orders = newBanners.map((b, i) => ({ id: b._id, order: i + 1 }));
        await api.patch('/banners/reorder', { orders });
        setBanners(newBanners.map((b, i) => ({ ...b, order: i + 1 })));
      } catch (error) {
        console.error('Error reordering banners:', error);
      }
    }
  };

  const moveDown = async (index) => {
    if (index < banners.length - 1) {
      const newBanners = [...banners];
      [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
      
      // Update order on server
      try {
        const orders = newBanners.map((b, i) => ({ id: b._id, order: i + 1 }));
        await api.patch('/banners/reorder', { orders });
        setBanners(newBanners.map((b, i) => ({ ...b, order: i + 1 })));
      } catch (error) {
        console.error('Error reordering banners:', error);
      }
    }
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({ title: '', subtitle: '', image: '', link: '/', cta: 'Shop Now', isActive: true });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({ title: '', subtitle: '', image: '', link: '/', cta: 'Shop Now', isActive: true });
  };

  if (loading) {
    return (
      <div className="banners-container">
        <div className="loading">Loading banners...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="banners-container">
        <div className="error">{error}</div>
        <button onClick={fetchBanners} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="banners-container">
      <div className="page-header">
        <h2 className="page-title">Banners & Carousels</h2>
        <button onClick={openAddModal} className="btn-primary">
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      <div className="banners-list">
        {banners.length === 0 ? (
          <div className="no-banners">
            <p>No banners found. Click "Add Banner" to create one.</p>
          </div>
        ) : (
          banners.map((banner, index) => (
            <div key={banner._id} className={`banner-item ${!banner.isActive ? 'inactive' : ''}`}>
              <div className="banner-preview">
                <img src={banner.image} alt={banner.title} />
                {!banner.isActive && (
                  <div className="inactive-overlay">
                    <span>Inactive</span>
                  </div>
                )}
              </div>
              <div className="banner-content">
                <div className="banner-info">
                  <h3 className="banner-title">{banner.title}</h3>
                  <p className="banner-subtitle">{banner.subtitle}</p>
                  <div className="banner-meta">
                    <span className="banner-link">Link: {banner.link}</span>
                    <span className="banner-order">Order: #{banner.order}</span>
                  </div>
                </div>
                <div className="banner-controls">
                  <div className="order-controls">
                    <button 
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="btn-icon btn-move"
                      title="Move Up"
                    >
                      <MoveUp size={18} />
                    </button>
                    <button 
                      onClick={() => moveDown(index)}
                      disabled={index === banners.length - 1}
                      className="btn-icon btn-move"
                      title="Move Down"
                    >
                      <MoveDown size={18} />
                    </button>
                  </div>
                  <div className="action-controls">
                    <button 
                      onClick={() => handleToggleActive(banner)}
                      className={`btn-toggle ${banner.isActive ? 'active' : ''}`}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => handleEdit(banner)} className="btn-icon btn-edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(banner._id)} className="btn-icon btn-delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </h3>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  placeholder="Enter banner title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input
                  type="text"
                  placeholder="Enter banner subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Link URL</label>
                <input
                  type="text"
                  placeholder="/sale"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">CTA Button Text</label>
                <input
                  type="text"
                  placeholder="Shop Now"
                  value={formData.cta}
                  onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="modal-actions">
                <button onClick={handleSubmit} className="btn-primary">
                  {editingBanner ? 'Update Banner' : 'Add Banner'}
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

export default BannersCarousels;
