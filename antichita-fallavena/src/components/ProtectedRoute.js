import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Lista di email autorizzate
  const authorizedEmails = [
    'francesco.fallavena@gmail.com',
  ];

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Verifica se l'email è autorizzata
  if (!authorizedEmails.includes(currentUser.email)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;