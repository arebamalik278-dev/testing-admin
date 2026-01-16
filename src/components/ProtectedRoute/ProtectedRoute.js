import React from 'react';

const ProtectedRoute = ({ children }) => {
  // Login requirement removed - always grant access
  return children;
};

export default ProtectedRoute;

