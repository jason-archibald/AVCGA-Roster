import React from 'react'; import { Navigate, useLocation } from 'react-router-dom'; import { useAuth } from '../hooks/useAuth';
const ProtectedRoute = ({ children }) => { const { user, loading } = useAuth(); if (loading) return <div>Loading...</div>; if (!user) return <Navigate to="/login" state={{ from: useLocation() }} replace />; return children; };
export default ProtectedRoute;
