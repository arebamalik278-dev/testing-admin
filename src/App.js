import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import api from './api/api';

// Dashboard Pages
import Overview from './pages/Dashboard/Overview/Overview';
import Analytics from './pages/Dashboard/Analytics/Analytics';
import RecentActivity from './pages/Dashboard/RecentActivity/RecentActivity';
import TopProducts from './pages/Dashboard/TopProducts/TopProducts';

// Product Pages
import ProductList from './pages/Products/ProductList/ProductList';
import Categories from './pages/Products/Categories/Categories';
import InventoryControl from './pages/Products/InventoryControl/InventoryControl';
import MediaUploads from './pages/Products/MediaUploads/MediaUploads';

// Orders & Customers Pages
import OrderTracking from './pages/OrdersCustomers/OrderTracking/OrderTracking';
import Invoicing from './pages/OrdersCustomers/Invoicing/Invoicing';
import CustomerDatabase from './pages/OrdersCustomers/CustomerDatabase/CustomerDatabase';

// Site Config Pages
import Settings from './pages/SiteConfig/Settings/Settings';
import BannersCarousels from './pages/SiteConfig/BannersCarousels/BannersCarousels';
import PaymentShipping from './pages/SiteConfig/PaymentShipping/PaymentShipping';

// Auth Pages
import Login from './pages/Login/Login';

import './App.css';

// Main App Layout Component
const AppLayout = () => {
  const [currentPage, setCurrentPage] = useState('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
      case 'analytics':
        return <Analytics />;
      case 'product-list':
        return <ProductList />;
      case 'order-tracking':
        return <OrderTracking />;
      case 'settings':
        return <Settings />;
      case 'recent-activity':
        return <RecentActivity />;
      case 'top-products':
        return <TopProducts />;
      case 'inventory-control':
        return <InventoryControl />;
      case 'categories':
        return <Categories />;
      case 'media-uploads':
        return <MediaUploads />;
      case 'invoicing':
        return <Invoicing />;
      case 'customer-database':
        return <CustomerDatabase />;
      case 'banners-carousels':
        return <BannersCarousels />;
      case 'payment-shipping':
        return <PaymentShipping />;
      default:
        return <Overview />;
    }
  };

  // Handle direct route navigation
  useEffect(() => {
    const path = location.pathname.substring(1) || 'overview';
    if (['overview', 'analytics', 'product-list', 'order-tracking', 'settings',
         'recent-activity', 'top-products', 'inventory-control', 'categories',
         'media-uploads', 'invoicing', 'customer-database', 'banners-carousels',
         'payment-shipping'].includes(path)) {
      setCurrentPage(path);
    }
  }, [location.pathname]);

  return (
    <div className="app-container">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={handlePageChange}
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />
      <div className="main-content">
        <Navbar 
          setIsMobileOpen={setIsMobileOpen} 
          user={api.getCurrentUser()}
          onLogout={handleLogout}
        />
        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// Login Page Component
const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.login(email, password);
      
      if (response.success) {
        // Check if user is admin
        const user = api.getCurrentUser();
        if (user && (user.role === 'admin' || user.role === 'user')) {
          navigate(from, { replace: true });
        } else {
          setError('Access denied. Admin privileges required.');
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, redirect to dashboard
  if (api.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <Login onLogin={handleLogin} loading={loading} error={error} />;
};

// Main App Component
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<LoginPage />} /> 

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        /> 

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/overview" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

