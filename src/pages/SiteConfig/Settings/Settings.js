import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'AF-Mart',
    siteEmail: 'admin@afmart.com',
    currency: 'USD',
    taxRate: '10',
    shippingFee: '5.99'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch settings from API
    const fetchSettings = async () => {
      try {
        // const data = await api.get('/api/settings');
        // setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    // fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // await api.put('/api/settings', settings);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h2 className="page-title">Settings</h2>

      <div className="settings-card">
        <h3 className="card-title">General Settings</h3>
        <div className="settings-form">
          <div className="form-group">
            <label className="form-label">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Site Email</label>
            <input
              type="email"
              value={settings.siteEmail}
              onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="form-input"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="PKR">PKR</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tax Rate (%)</label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Shipping Fee ($)</label>
              <input
                type="number"
                value={settings.shippingFee}
                onChange={(e) => setSettings({ ...settings, shippingFee: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {message && (
            <div className={`message ${message.includes('Error') ? 'message-error' : 'message-success'}`}>
              {message}
            </div>
          )}

          <button 
            onClick={handleSave} 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;