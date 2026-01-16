import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, MoveUp, MoveDown, Eye } from 'lucide-react';
import api from '../../../api/api';
import './BannersCarousels.css';

const BannersCarousels = () => {
  const [banners, setBanners] = useState([
    { id: 1, title: 'Summer Sale 2026', subtitle: 'Up to 50% off on selected items', image: 'https://via.placeholder.com/800x300/3b82f6/ffffff?text=Summer+Sale', link: '/sale', order: 1, active: true },
    { id: 2, title: 'New Arrivals', subtitle: 'Check out our latest products', image: 'https://via.placeholder.com/800x300/8b5cf6/ffffff?text=New+Arrivals', link: '/new', order: 2, active: true },
    { id: 3, title: 'Free Shipping', subtitle: 'On orders over Rs 5,000', image: 'https://via.placeholder.com/800x300/10b981/ffffff?text=Free+Shipping', link: '/shipping', order: 3, active: false }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    active: true
  });

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // const data = await api.get('/api/banners');
        // setBanners(data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    // fetchBanners();
  }, []);

  const handleSubmit = async () => {
    if (formData.title) {
      try {
        if (editingBanner) {
          // await api.put(`/api/banners/${editingBanner.id}`, formData);
          setBanners(banners.map(banner => 
            banner.id === editingBanner.id 
              ? { ...banner, ...formData }
              : banner
          ));
        } else {
          // const newBanner = await api.post('/api/banners', formData);
          setBanners([...banners, {
            ...formData,
            id: banners.length + 1,
            order: banners.length + 1
          }]);
        }
        
        closeModal();
      } catch (error) {
        console.error('Error saving banner:', error);
      }
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      active: banner.active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        // await api.delete(`/api/banners/${id}`);
        setBanners(banners.filter(banner => banner.id !== id));
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  const handleToggleActive = async (id) => {
    const banner = banners.find(b => b.id === id);
    try {
      // await api.put(`/api/banners/${id}`, { ...banner, active: !banner.active });
      setBanners(banners.map(b => 
        b.id === id ? { ...b, active: !b.active } : b
      ));
    } catch (error) {
      console.error('Error toggling banner:', error);
    }
  };

  const moveUp = (index) => {
    if (index > 0) {
      const newBanners = [...banners];
      [newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]];
      setBanners(newBanners.map((b, i) => ({ ...b, order: i + 1 })));
    }
  };

  const moveDown = (index) => {
    if (index < banners.length - 1) {
      const newBanners = [...banners];
      [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
      setBanners(newBanners.map((b, i) => ({ ...b, order: i + 1 })));
    }
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({ title: '', subtitle: '', image: '', link: '', active: true });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({ title: '', subtitle: '', image: '', link: '', active: true });
  };

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
        {banners.map((banner, index) => (
          <div key={banner.id} className={`banner-item ${!banner.active ? 'inactive' : ''}`}>
            <div className="banner-preview">
              <img src={banner.image} alt={banner.title} />
              {!banner.active && (
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
                    onClick={() => handleToggleActive(banner.id)}
                    className={`btn-toggle ${banner.active ? 'active' : ''}`}
                  >
                    {banner.active ? 'Active' : 'Inactive'}
                  </button>
                  <button onClick={() => handleEdit(banner)} className="btn-icon btn-edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="btn-icon btn-delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </h3>
            <div className="modal-form">
              <div className="form-group">
                <label className="form-label">Title</label>
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
                <label className="form-label">Image URL</label>
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
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
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