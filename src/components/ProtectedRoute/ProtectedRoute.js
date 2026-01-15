import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../../api/api';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Check if user is authenticated
  const isAuthenticated = api.isAuthenticated();

  // Get current user
  const user = api.getCurrentUser();

  if (!isAuthenticated) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin (optional - can be enabled for admin-only routes)
  if (user && user.role !== 'admin' && user.role !== 'user') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

