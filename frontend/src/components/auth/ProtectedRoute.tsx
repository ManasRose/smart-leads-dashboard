import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FullPageSpinner } from '../ui/Spinner';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, token } = useAuth();

  // Still loading (token exists but user not yet fetched)
  if (token && !isAuthenticated) return <FullPageSpinner />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
