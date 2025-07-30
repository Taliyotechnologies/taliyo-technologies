import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      // Redirect to login if no token
      navigate('/admin/login');
      return;
    }

    // Verify token with backend (optional but recommended)
    const verifyToken = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/admin/verify-token`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          // Token is invalid, redirect to login
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
          return;
        }
        const data = await response.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
        } else {
          // Set default user if no user data
          setCurrentUser({ email: 'admin@taliyo.com', role: 'admin' });
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token verification failed:', error);
        // On network error, still allow access but log the error
        setCurrentUser({ email: 'admin@taliyo.com', role: 'admin' });
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const allFeatures = ['Analytics', 'Leads', 'Users', 'Projects', 'Team', 'Logs', 'Settings'];

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Sidebar (responsive) */}
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex bg-gray-900 h-screen w-60 p-6 flex-col space-y-4 border-r border-gray-800 fixed top-0 left-0 z-40">
        <Sidebar features={currentUser?.role === 'admin' ? allFeatures : (currentUser?.features || [])} />
      </aside>
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed top-0 left-0 h-full w-64 bg-gray-900 p-6 flex flex-col space-y-4 border-r border-gray-800 z-50 transition-transform duration-200">
            <button className="mb-6 self-end text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={28} />
            </button>
            <Sidebar features={currentUser?.role === 'admin' ? allFeatures : (currentUser?.features || [])} />
          </aside>
        </>
      )}
      {/* Main content area with topbar */}
      <div className="flex-1 flex flex-col lg:ml-60 min-h-screen">
        {/* Topbar */}
        <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 px-4 sm:px-8 py-4 sticky top-0 z-30">
          {/* Hamburger for mobile */}
          <button className="lg:hidden text-gray-300 hover:text-white mr-2" onClick={() => setSidebarOpen(true)}>
            <Menu size={28} />
          </button>
          <span className="text-gray-300 font-medium">Logged in as <span className="text-blue-400">{currentUser?.email || 'admin@taliyo.com'}</span></span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
          >
            Logout
          </button>
        </div>
        {/* Main content */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 