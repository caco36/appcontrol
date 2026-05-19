import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuthStore();
  const location = useLocation();

  if (!token) {
    // Redireciona para login salvando a rota de origem
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
