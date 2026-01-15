import React, { useState } from 'react';
import { 
  Upload, Image, Video, Folder, Trash2, Eye, Download, 
  Search, Grid, List, Check, X, MoreVertical, FolderPlus,
  CloudUpload, FileImage, FileVideo, File
} from 'lucide-react';
import './MediaUploads.css';

const MediaUploads = () => {
  const [media, setMedia] = useState([
    { id: 1, type: 'image', name: 'iphone-15-pro.jpg', url: 'https://via.placeholder.com/200x200/3b82f6/ffffff?text=iPhone', size: '2.4 MB', dimensions: '2000x2000', uploadedAt: '2 hours ago', folder: 'products' },
    { id: 2, type: 'image', name: 'macbook-air.jpg', url: 'https://via.placeholder.com/200x200/10b981/ffffff?text=MacBook', size: '3.1 MB', dimensions: '2500x1600', uploadedAt: '3 hours ago', folder: 'products' },
    { id: 3, type: 'image', name: 'banner-summer.jpg', url: 'https://via.placeholder.com/400x200/f59e0b/ffffff?text=Summer+Banner', size: '1.8 MB', dimensions: '1920x600', uploadedAt: '5 hours ago', folder: 'banners' },
    { id: 4, type: 'video', name: 'product-demo.mp4', url: null, size: '45.2 MB', dimensions: '1920x1080', uploadedAt: '1 day ago', folder: 'videos' },
    { id: 5, type: 'image', name: 'airpods-pro.jpg', url: 'https://via.placeholder.com/200x200/8b5cf6/ffffff?text=AirPods', size: '1.2 MB', dimensions: '1500x1500', uploadedAt: '2 days ago', folder: 'products' },
    { id: 6, type: 'image', name: 'logo-dark.png', url: 'https://via.placeholder.com/200x200/111827/ffffff?text=Logo', size: '156 KB', dimensions: '500x500', uploadedAt: '3 days ago', folder: 'branding' },
    { id: 7, type: 'image', name: 'ipad-pro.jpg', url: 'https://via.placeholder.com/200x200/ec4899/ffffff?text=iPad', size: '2.8 MB', dimensions: '2200x1700', uploadedAt: '4 days ago', folder: 'products' },
    { id: 8, type: 'image', name: 'watch-ultra.jpg', url: 'https://via.placeholder.com/200x200/ef4444/ffffff?text=Watch', size: '1.9 MB', dimensions: '1800x2000', uploadedAt: '5 days ago', folder: 'products' }
  ]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentFolder, setCurrentFolder] = useState('all');

  const folders = [
    { id: 'all', name: 'All Files', icon: Folder, count: media.length },
    { id: 'products', name: 'Products', icon: FileImage, count: media.filter(m => m.folder === 'products').length },
    { id: 'banners', name: 'Banners', icon: Image, count: media.filter(m => m.folder === 'banners').length },
    { id: 'videos', name: 'Videos', icon: FileVideo, count: media.filter(m => m.folder === 'videos').length },
    { id: 'branding', name: 'Branding', icon: File, count: media.filter(m => m.folder === 'branding').length }
  ];

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesFolder = currentFolder === 'all' || item.folder === currentFolder;
    return matchesSearch && matchesType && matchesFolder;
  });

  const toggleSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setMedia(media.filter(item => item.id !== id));
      setSelectedItems(selectedItems.filter(i => i !== id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} files?`)) {
      setMedia(media.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={24} />;
      default: return <Image size={24} />;
    }
  };

  return (
    <div className="media-uploads-page animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Media Library</h1>
          <p className="page-subtitle">Manage your images, videos, and files.</p>
        </div>
        <div className="page-actions">
          <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
            <CloudUpload size={18} />
            Upload Files
          </button>
        </div>
      </div>

      <div className="media-layout">
        {/* Sidebar Folders */}
        <div className="media-sidebar">
          <h3 className="sidebar-title">Folders</h3>
          <div className="folder-list">
            {folders.map(folder => {
              const Icon = folder.icon;
              return (
                <button
                  key={folder.id}
                  className={`folder-item ${currentFolder === folder.id ? 'active' : ''}`}
                  onClick={() => setCurrentFolder(folder.id)}
                >
                  <Icon size={18} />
                  <span className="folder-name">{folder.name}</span>
                  <span className="folder-count">{folder.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="media-main">
          {/* Toolbar */}
          <div className="media-toolbar">
            <div className="toolbar-left">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>
            </div>

            <div className="toolbar-right">
              {selectedItems.length > 0 && (
                <button onClick={handleBulkDelete} className="btn btn-danger">
                  <Trash2 size={16} />
                  Delete ({selectedItems.length})
                </button>
              )}
              
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Media Grid/List */}
          {viewMode === 'grid' ? (
            <div className="media-grid">
              {filteredMedia.map(item => (
                <div 
                  key={item.id} 
                  className={`media-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item.id)}
                >
                  {selectedItems.includes(item.id) && (
                    <div className="selection-badge">
                      <Check size={14} />
                    </div>
                  )}
                  <div className="media-preview">
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.name} />
                    ) : (
                      <div className="media-placeholder">
                        {getMediaIcon(item.type)}
                      </div>
                    )}
                  </div>
                  <div className="media-info">
                    <p className="media-name">{item.name}</p>
                    <p className="media-meta">{item.size}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="media-list">
              <table>
                <thead>
                  <tr>
                    <th className="checkbox-cell">
                      <input type="checkbox" />
                    </th>
                    <th>File</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Dimensions</th>
                    <th>Uploaded</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedia.map(item => (
                    <tr key={item.id} className={selectedItems.includes(item.id) ? 'selected' : ''}>
                      <td className="checkbox-cell">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelection(item.id)}
                        />
                      </td>
                      <td>
                        <div className="file-cell">
                          <div className="file-thumbnail">
                            {item.type === 'image' ? (
                              <img src={item.url} alt={item.name} />
                            ) : (
                              <div className="file-icon">{getMediaIcon(item.type)}</div>
                            )}
                          </div>
                          <span className="file-name">{item.name}</span>
                        </div>
                      </td>
                      <td><span className={`type-badge ${item.type}`}>{item.type}</span></td>
                      <td>{item.size}</td>
                      <td>{item.dimensions}</td>
                      <td>{item.uploadedAt}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-icon" title="Download">
                            <Download size={16} />
                          </button>
                          <button className="btn-icon" title="Delete" onClick={() => handleDelete(item.id)}>
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
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal upload-modal">
            <div className="modal-header">
              <h3 className="modal-title">Upload Files</h3>
              <button className="modal-close" onClick={() => setShowUploadModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="upload-area">
              <CloudUpload size={48} className="upload-icon" />
              <h4 className="upload-title">Drag and drop files here</h4>
              <p className="upload-text">or click to browse</p>
              <input type="file" multiple className="upload-input" />
              <button className="btn btn-primary">
                Browse Files
              </button>
            </div>
            <div className="modal-footer">
              <p className="supported-formats">Supported: JPG, PNG, GIF, MP4, PDF (Max 50MB)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploads;

