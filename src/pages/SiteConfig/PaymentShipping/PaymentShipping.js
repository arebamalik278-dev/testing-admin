import React, { useState } from 'react';
import { 
  CreditCard, Shield, Save, 
  Wallet, Smartphone, Building2 
} from 'lucide-react';
import './PaymentShipping.css';

const PaymentShipping = () => {
  const [activeSection, setActiveSection] = useState('payment');
  const [editingPayment, setEditingPayment] = useState(null);
  
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

  const togglePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.map(method => 
      method.id === id ? { ...method, enabled: !method.enabled } : method
    ));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/settings/payment-methods`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethods }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Payment methods saved successfully!');
      } else {
        alert('Error saving payment methods: ' + data.message);
      }
    } catch (error) {
      alert('Error saving payment methods: ' + error.message);
    }
  };

  return (
    <div className="payment-shipping-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Payment Methods</h1>
          <p className="page-subtitle">Configure payment methods available for Pakistani customers</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="section-content animate-fade-in">
        <div className="config-section">
          <div className="section-header">
            <div className="section-header-icon">
              <Wallet size={22} />
            </div>
            <div>
              <h2 className="section-title">Payment Methods</h2>
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
    </div>
  );
};

export default PaymentShipping;
