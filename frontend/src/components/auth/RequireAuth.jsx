import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setValid(false);
      return;
    }

    // Validate token with backend
    const checkAuth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(`${API}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId));
        if (res.ok) {
          setValid(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setValid(false);
        }
      } catch (e) {
        // On network error/timeout, treat as invalid and clear token to avoid loops
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">Checking authentication...</div>
    );
  }

  if (!valid) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
