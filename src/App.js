import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Login Page
import Login from './pages/Login/Login';

// Dashboard Pages
import Overview from './pages/Dashboard/Overview/Overview';
import Analytics from './pages/Dashboard/Analytics/Analytics';
import RecentActivity from './pages/Dashboard/RecentActivity/RecentActivity';
import TopProducts from './pages/Dashboard/TopProducts/TopProducts';

// Product Pages
import ProductList from './pages/Products/ProductList/ProductList';
import Categories from './pages/Products/Categories/Categories';
import InventoryControl from './pages/Products/InventoryControl/InventoryControl';


// Orders & Customers Pages
import OrderTracking from './pages/OrdersCustomers/OrderTracking/OrderTracking';
import Invoicing from './pages/OrdersCustomers/Invoicing/Invoicing';
import CustomerDatabase from './pages/OrdersCustomers/CustomerDatabase/CustomerDatabase';

// Site Config Pages
import Settings from './pages/SiteConfig/Settings/Settings';
import BannersCarousels from './pages/SiteConfig/BannersCarousels/BannersCarousels';
import PaymentShipping from './pages/SiteConfig/PaymentShipping/PaymentShipping';

import './App.css';

// Main App Layout Component
const AppLayout = () => {
  const [currentPage, setCurrentPage] = useState('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
    navigate(`/${pageId}`); // Update URL when page changes
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
    const validPages = ['overview', 'analytics', 'product-list', 'order-tracking', 'settings',
         'recent-activity', 'top-products', 'inventory-control', 'categories',
         'invoicing', 'customer-database', 'banners-carousels',
         'payment-shipping'];
          
    if (validPages.includes(path)) {
      setCurrentPage(path);
    } else {
      // Redirect to overview if invalid path
      navigate('/overview');
    }
  }, [location.pathname, navigate]);

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
        />
        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        /> 

        {/* Redirect root to login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
