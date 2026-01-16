import React, { useState } from 'react';
import { 
  CreditCard, Truck, Shield, Save, Edit2, Check, 
  Plus, Trash2, ChevronDown, Globe, Building2, 
  Wallet, Smartphone, Landmark
} from 'lucide-react';
import './PaymentShipping.css';

const PaymentShipping = () => {
  const [activeSection, setActiveSection] = useState('payment');
  const [editingPayment, setEditingPayment] = useState(null);
  const [editingShipping, setEditingShipping] = useState(null);
  
  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'cod', name: 'Cash on Delivery', enabled: true, fee: 0, description: 'Pay with cash when your order is delivered' },
    { id: 'jazzcash', name: 'JazzCash', enabled: true, fee: 0, description: 'Mobile wallet payments via JazzCash' },
    { id: 'easypaisa', name: 'EasyPaisa', enabled: true, fee: 0, description: 'Mobile wallet payments via EasyPaisa' },
    { id: 'bank_transfer', name: 'Bank Transfer', enabled: true, fee: 0, description: 'Direct bank transfer to our account' },
    { id: 'card', name: 'Credit/Debit Card', enabled: false, fee: 2.5, description: 'Visa, Mastercard, UnionPay' },
    { id: 'nayapay', name: 'NayaPay', enabled: false, fee: 0, description: 'NayaPay digital wallet' },
    { id: 'sadapay', name: 'SadaPay', enabled: false, fee: 0, description: 'SadaPay digital wallet' },
    { id: 'keenu', name: 'Keenu', enabled: false, fee: 0, description: 'Keenu mobile payments' },
  ]);

  // Shipping zones state
  const [shippingZones, setShippingZones] = useState([
    { 
      id: 1, 
      name: 'Karachi', 
      regions: ['Karachi'],
      codEnabled: true,
      codMin: 0,
      codMax: 50000,
      prePaidEnabled: true,
      prePaidFee: 99,
      estimatedDays: '1-2 days'
    },
    { 
      id: 2, 
      name: 'Lahore', 
      regions: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan'],
      codEnabled: true,
      codMin: 0,
      codMax: 50000,
      prePaidEnabled: true,
      prePaidFee: 199,
      estimatedDays: '2-4 days'
    },
    { 
      id: 3, 
      name: 'Other Cities', 
      regions: ['Islamabad', 'Peshawar', 'Quetta', 'Hyderabad', 'Sukkur', 'Gujranwala', 'Sialkot'],
      codEnabled: true,
      codMin: 0,
      codMax: 50000,
      prePaidEnabled: true,
      prePaidFee: 249,
      estimatedDays: '3-5 days'
    },
    { 
      id: 4, 
      name: 'Remote Areas', 
      regions: ['Balochistan', 'Khyber Pakhtunkhwa (Remote)', 'Northern Areas', 'FATA'],
      codEnabled: false,
      codMin: 0,
      codMax: 0,
      prePaidEnabled: true,
      prePaidFee: 499,
      estimatedDays: '5-7 days'
    }
  ]);

  // Free shipping threshold
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(5000);

  const togglePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.map(method => 
      method.id === id ? { ...method, enabled: !method.enabled } : method
    ));
  };

  const toggleShippingZone = (id) => {
    setShippingZones(shippingZones.map(zone => 
      zone.id === id ? { ...zone, prePaidEnabled: !zone.prePaidEnabled } : zone
    ));
  };

  const handleSave = () => {
    // Save logic here
    alert('Settings saved successfully!');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="payment-shipping-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Payment & Shipping</h1>
          <p className="page-subtitle">Configure payment methods and shipping zones for Pakistan</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="section-tabs">
        <button 
          className={`section-tab ${activeSection === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveSection('payment')}
        >
          <CreditCard size={18} />
          Payment Methods
        </button>
        <button 
          className={`section-tab ${activeSection === 'shipping' ? 'active' : ''}`}
          onClick={() => setActiveSection('shipping')}
        >
          <Truck size={18} />
          Shipping Zones
        </button>
        <button 
          className={`section-tab ${activeSection === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          <Shield size={18} />
          Settings
        </button>
      </div>

      {/* Payment Methods Section */}
      {activeSection === 'payment' && (
        <div className="section-content animate-fade-in">
          <div className="config-section">
            <div className="section-header">
              <div className="section-header-icon">
                <Wallet size={22} />
              </div>
              <div>
                <h2 className="section-title">Payment Methods</h2>
                <p className="section-description">Enable and configure payment methods available for Pakistani customers</p>
              </div>
            </div>

            <div className="payment-methods-grid">
              {paymentMethods.map(method => {
                const Icon = method.id === 'jazzcash' || method.id === 'easypaisa' || method.id === 'nayapay' || method.id === 'sadapay' || method.id === 'keenu' 
                  ? Smartphone 
                  : method.id === 'bank_transfer' 
                    ? Building2 
                    : method.id === 'card' 
                      ? CreditCard 
                      : Wallet;
                return (
                  <div 
                    key={method.id} 
                    className={`payment-card ${method.enabled ? 'enabled' : 'disabled'}`}
                  >
                    <div className="payment-icon-wrapper">
                      <Icon size={24} />
                    </div>
                    <div className="payment-info">
                      <h3 className="payment-name">{method.name}</h3>
                      <p className="payment-description">{method.description}</p>
                      {method.fee > 0 && (
                        <span className="payment-fee">{method.fee}% transaction fee</span>
                      )}
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={method.enabled}
                        onChange={() => togglePaymentMethod(method.id)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Shipping Zones Section */}
      {activeSection === 'shipping' && (
        <div className="section-content animate-fade-in">
          {/* Free Shipping Settings */}
          <div className="config-section mb-6">
            <div className="section-header">
              <div className="section-header-icon">
                <Globe size={22} />
              </div>
              <div>
                <h2 className="section-title">Free Shipping Threshold</h2>
                <p className="section-description">Set the minimum order value for free shipping across Pakistan</p>
              </div>
            </div>
            <div className="free-shipping-settings">
              <div className="form-group">
                <label className="form-label">Free Shipping Minimum Order</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">Rs</span>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(parseInt(e.target.value))}
                    className="form-input"
                    min="0"
                  />
                </div>
                <p className="form-help">Orders above Rs {freeShippingThreshold.toLocaleString()} get free shipping</p>
              </div>
            </div>
          </div>

          {/* Shipping Zones */}
          <div className="config-section">
            <div className="section-header">
              <div className="section-header-icon">
                <Truck size={22} />
              </div>
              <div>
                <h2 className="section-title">Shipping Zones</h2>
                <p className="section-description">Configure shipping rates for different regions in Pakistan</p>
              </div>
              <button className="btn btn-secondary btn-sm">
                <Plus size={16} />
                Add Zone
              </button>
            </div>

            <div className="shipping-zones-list">
              {shippingZones.map(zone => (
                <div key={zone.id} className={`zone-card ${!zone.prePaidEnabled ? 'disabled' : ''}`}>
                  <div className="zone-header">
                    <div className="zone-info">
                      <h3 className="zone-name">{zone.name}</h3>
                      <p className="zone-regions">
                        <Globe size={14} />
                        {zone.regions.join(', ')}
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={zone.prePaidEnabled}
                        onChange={() => toggleShippingZone(zone.id)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="zone-details">
                    <div className="zone-detail-item">
                      <Truck size={16} />
                      <span>Pre-paid Shipping:</span>
                      <strong>{zone.prePaidEnabled ? formatCurrency(zone.prePaidFee) : 'Disabled'}</strong>
                    </div>
                    <div className="zone-detail-item">
                      <Landmark size={16} />
                      <span>COD Available:</span>
                      <span className={`status-badge ${zone.codEnabled ? 'enabled' : 'disabled'}`}>
                        {zone.codEnabled ? `Up to ${formatCurrency(zone.codMax)}` : 'Not Available'}
                      </span>
                    </div>
                    <div className="zone-detail-item">
                      <Shield size={16} />
                      <span>Estimated Delivery:</span>
                      <strong>{zone.estimatedDays}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Section */}
      {activeSection === 'settings' && (
        <div className="section-content animate-fade-in">
          <div className="config-section">
            <div className="section-header">
              <div className="section-header-icon">
                <Shield size={22} />
              </div>
              <div>
                <h2 className="section-title">General Settings</h2>
                <p className="section-description">Configure general payment and shipping settings</p>
              </div>
            </div>

            <div className="settings-form">
              <div className="form-group">
                <label className="form-label">Maximum COD Order Value</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">Rs</span>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={50000}
                  />
                </div>
                <p className="form-help">Cash on Delivery will not be available for orders above this amount</p>
              </div>

              <div className="form-group">
                <label className="form-label">Standard Shipping Fee (Within City)</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">Rs</span>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={99}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Standard Shipping Fee (Other Cities)</label>
                <div className="input-with-prefix">
                  <span className="input-prefix">Rs</span>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={199}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Order Processing Time</label>
                <select className="form-input">
                  <option value="1">1 Business Day</option>
                  <option value="2">2 Business Days</option>
                  <option value="3" selected>3 Business Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentShipping;

