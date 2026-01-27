import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if admin token exists in localStorage
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  // If token exists, allow access to the protected route
  return children;
};

export default ProtectedRoute;

