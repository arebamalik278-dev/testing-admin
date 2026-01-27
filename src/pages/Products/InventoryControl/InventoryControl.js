import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, Package, RefreshCw } from 'lucide-react';
import api from '../../../api/api';
import socketService from '../../../services/socketService';
import './InventoryControl.css';

const InventoryControl = () => {
  const [inventory, setInventory] = useState([]);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restockAmount, setRestockAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine inventory status based on stock and reorder level
  const determineStatus = (stock, reorderLevel) => {
    if (stock <= 0) return 'critical';
    if (stock <= reorderLevel * 0.5) return 'critical';
    if (stock <= reorderLevel) return 'low';
    return 'good';
  };

  // Fetch inventory data and connect socket
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setError(null);
        const response = await api.get('/products/admin/all');
        console.log('API Response:', response);
        
        // Check if response has the expected structure
        if (response.data && Array.isArray(response.data)) {
          // Response is directly the array
          const inventoryData = response.data.map(product => ({
            id: product._id,
            name: product.name,
            sku: product.sku || `SKU-${product._id?.slice(-6).toUpperCase()}`,
            stock: product.stock,
            reorderLevel: product.reorderLevel || 10,
            status: determineStatus(product.stock, product.reorderLevel || 10),
            location: product.location || 'Warehouse A'
          }));
          setInventory(inventoryData);
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Response is { success, data: [...] }
          const inventoryData = response.data.data.map(product => ({
            id: product._id,
            name: product.name,
            sku: product.sku || `SKU-${product._id?.slice(-6).toUpperCase()}`,
            stock: product.stock,
            reorderLevel: product.reorderLevel || 10,
            status: determineStatus(product.stock, product.reorderLevel || 10),
            location: product.location || 'Warehouse A'
          }));
          setInventory(inventoryData);
        } else {
          console.error('Unexpected response structure:', response);
          setError('Unexpected data format from server');
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
        setError(error.message || 'Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();

    // Connect to socket and listen for real-time updates
    const connectSocket = async () => {
      try {
        await socketService.connect();
        
        // Listen for product updates
        socketService.on('PRODUCT_UPDATED', (updatedProduct) => {
          setInventory(prevInventory => 
            prevInventory.map(item => {
              if (item.id === updatedProduct._id) {
                return {
                  ...item,
                  stock: updatedProduct.stock,
                  status: determineStatus(updatedProduct.stock, item.reorderLevel),
                  name: updatedProduct.name,
                  location: updatedProduct.location || item.location
                };
              }
              return item;
            })
          );
        });

        // Listen for product deletions
        socketService.on('PRODUCT_DELETED', (deletedProduct) => {
          setInventory(prevInventory => 
            prevInventory.filter(item => item.id !== deletedProduct._id)
          );
        });

        // Listen for product creations
        socketService.on('PRODUCT_CREATED', (newProduct) => {
          setInventory(prevInventory => [
            ...prevInventory,
            {
              id: newProduct._id,
              name: newProduct.name,
              sku: `SKU-${newProduct._id?.slice(-6).toUpperCase()}`,
              stock: newProduct.stock,
              reorderLevel: newProduct.reorderLevel || 10,
              status: determineStatus(newProduct.stock, newProduct.reorderLevel || 10),
              location: newProduct.location || 'Warehouse A'
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

  const getStatusBadge = (status) => {
    const badges = {
      'critical': { class: 'status-critical', icon: AlertTriangle, text: 'Critical' },
      'low': { class: 'status-low', icon: TrendingDown, text: 'Low Stock' },
      'good': { class: 'status-good', icon: Package, text: 'In Stock' }
    };
    return badges[status] || badges['good'];
  };

  const handleRestock = async () => {
    if (selectedProduct && restockAmount) {
      try {
        await api.patch(`/products/${selectedProduct.id}/stock`, {
          stock: parseInt(restockAmount),
          operation: 'add'
        });
        
        // Update local state
        setInventory(inventory.map(item => 
          item.id === selectedProduct.id 
            ? { 
                ...item, 
                stock: item.stock + parseInt(restockAmount),
                status: determineStatus(item.stock + parseInt(restockAmount), item.reorderLevel)
              }
            : item
        ));
        
        setShowRestockModal(false);
        setSelectedProduct(null);
        setRestockAmount('');
      } catch (error) {
        console.error('Error restocking:', error);
      }
    }
  };

  const openRestockModal = (product) => {
    setSelectedProduct(product);
    setShowRestockModal(true);
  };

  const lowStockCount = inventory.filter(item => item.status === 'low' || item.status === 'critical').length;

  return (
    <div className="inventory-control-container">
      <div className="page-header">
        <h2 className="page-title">Inventory Control</h2>
        <div className="inventory-summary">
          <div className="summary-badge critical">
            <AlertTriangle size={20} />
            <span>{inventory.filter(i => i.status === 'critical').length} Critical</span>
          </div>
          <div className="summary-badge low">
            <TrendingDown size={20} />
            <span>{inventory.filter(i => i.status === 'low').length} Low Stock</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading inventory data...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      ) : inventory.length === 0 ? (
        <div className="empty-container">
          <Package size={48} />
          <p>No products found in inventory</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Current Stock</th>
                  <th>Reorder Level</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const statusInfo = getStatusBadge(item.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="product-name">{item.name}</div>
                      </td>
                      <td className="text-gray">{item.sku}</td>
                      <td>
                        <span className={`stock-value ${item.status}`}>
                          {item.stock} units
                        </span>
                      </td>
                      <td className="text-gray">{item.reorderLevel} units</td>
                      <td className="text-gray">{item.location}</td>
                      <td>
                        <span className={`status-badge ${statusInfo.class}`}>
                          <StatusIcon size={14} />
                          {statusInfo.text}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => openRestockModal(item)}
                          className="btn-restock"
                        >
                          <RefreshCw size={16} />
                          Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showRestockModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Restock Product</h3>
            <div className="modal-content">
              <p className="restock-info">
                <strong>{selectedProduct.name}</strong> (SKU: {selectedProduct.sku})
              </p>
              <p className="current-stock">Current Stock: {selectedProduct.stock} units</p>
              
              <div className="form-group">
                <label className="form-label">Restock Amount</label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="form-input"
                  min="1"
                />
              </div>

              {restockAmount && (
                <p className="new-stock">
                  New Stock: {selectedProduct.stock + parseInt(restockAmount || 0)} units
                </p>
              )}

              <div className="modal-actions">
                <button onClick={handleRestock} className="btn-primary">
                  Confirm Restock
                </button>
                <button 
                  onClick={() => {
                    setShowRestockModal(false);
                    setSelectedProduct(null);
                    setRestockAmount('');
                  }} 
                  className="btn-secondary"
                >
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

export default InventoryControl;
