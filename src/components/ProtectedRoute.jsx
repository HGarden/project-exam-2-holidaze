/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import ctx from './context.jsx';

export function ProtectedRoute({ children }) {
  const { auth } = useContext(ctx);
  const location = useLocation();
  if (!auth?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export function ManagerRoute({ children }) {
  const { auth } = useContext(ctx);
  const location = useLocation();
  if (!auth?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!auth?.user?.venueManager) {
    return <Navigate to="/" replace />;
  }
  return children;
}
