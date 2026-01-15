import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please enter both email and password');
      return;
    }

    try {
      await onLogin(email, password);
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">AF-Mart</span>
          </div>
          <h1 className="login-title">Admin Panel</h1>
          <p className="login-subtitle">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {(localError || error) && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{localError || error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input with-icon"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input with-icon"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="demo-hint">
            Demo credentials: admin@example.com / admin123
          </p>
        </div>
      </div>
{/* 
      <div className="login-features">
        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span className="feature-text">Real-time Analytics</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📦</span>
            <span className="feature-text">Inventory Management</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛒</span>
            <span className="feature-text">Order Tracking</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">👥</span>
            <span className="feature-text">Customer Database</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Login;

