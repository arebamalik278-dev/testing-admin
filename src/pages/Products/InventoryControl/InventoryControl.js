import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, Package, RefreshCw } from 'lucide-react';
import api from '../../../api/api';
import './InventoryControl.css';

const InventoryControl = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Wireless Headphones', sku: 'WH-001', stock: 5, reorderLevel: 10, status: 'low', location: 'Warehouse A' },
    { id: 2, name: 'Smart Watch', sku: 'SW-002', stock: 2, reorderLevel: 5, status: 'critical', location: 'Warehouse B' },
    { id: 3, name: 'Laptop Stand', sku: 'LS-003', stock: 45, reorderLevel: 15, status: 'good', location: 'Warehouse A' },
    { id: 4, name: 'USB-C Cable', sku: 'UC-004', stock: 156, reorderLevel: 50, status: 'good', location: 'Warehouse C' },
    { id: 5, name: 'Wireless Mouse', sku: 'WM-005', stock: 12, reorderLevel: 20, status: 'low', location: 'Warehouse A' }
  ]);

  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restockAmount, setRestockAmount] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // const data = await api.get('/api/inventory');
        // setInventory(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    // fetchInventory();
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
        // await api.put(`/api/inventory/${selectedProduct.id}/restock`, {
        //   amount: parseInt(restockAmount)
        // });
        
        setInventory(inventory.map(item => 
          item.id === selectedProduct.id 
            ? { ...item, stock: item.stock + parseInt(restockAmount) }
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