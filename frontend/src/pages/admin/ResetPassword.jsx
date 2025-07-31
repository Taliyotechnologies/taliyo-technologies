// This page is meant to be rendered WITHOUT nav/footer/layout (see App.jsx route config)
import React, { useState } from 'react';
import ResetPasswordError from './ResetPasswordError';

function getTokenFromUrl() {
  // First try to get token from query parameter (current backend implementation)
  const params = new URLSearchParams(window.location.search);
  const queryToken = params.get('token');
  
  if (queryToken) {
    return queryToken;
  }
  
  // Fallback: try to get token from URL path parameter
  const pathParts = window.location.pathname.split('/');
  const tokenIndex = pathParts.indexOf('reset-password') + 1;
  if (tokenIndex < pathParts.length) {
    return pathParts[tokenIndex];
  }
  
  return '';
}

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = getTokenFromUrl();
  const API_URL = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';

  // Debug logging
  console.log('ResetPassword component loaded');
  console.log('Current URL:', window.location.href);
  console.log('Token extracted:', token ? 'Present' : 'Missing');
  console.log('Token length:', token ? token.length : 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    console.log('Reset password form submitted');
    console.log('Token from URL:', token);
    console.log('Password length:', password.length);
    console.log('Confirm password length:', confirm.length);
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    
    if (!token) {
      setError('Reset token is missing. Please use the link from your email.');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Sending reset password request...');
      
      const res = await fetch(`${API_URL}/api/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      
      console.log('Response status:', res.status);
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (!data.success) {
        setError(data.message || 'Failed to reset password');
      } else {
        setSuccess('Password reset successful! You can now log in.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If no token, show error page
  if (!token) {
    return <ResetPasswordError errorType="invalid" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      {/* Debug info - remove this later */}
      <div className="fixed top-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
        ResetPassword Component Loaded
      </div>
      
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/95 shadow-2xl rounded-2xl p-10 w-full max-w-md flex flex-col gap-7 border border-gray-800"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-400 tracking-tight">Reset Password</h2>
        <div>
          <label className="block text-gray-200 font-medium mb-1">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800 placeholder-gray-500 pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-blue-400 hover:text-blue-200"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-200 font-medium mb-1">Confirm Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800 placeholder-gray-500"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
            placeholder="Confirm new password"
          />
        </div>
        {error && <div className="text-red-400 text-center text-sm font-medium">{error}</div>}
        {success && <div className="text-green-400 text-center text-sm font-medium">{success}</div>}
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-bold py-2 rounded-lg shadow-md transition disabled:opacity-60"
          disabled={loading || !token}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {success && (
          <a href="/admin/login" className="block text-center text-blue-400 mt-4 underline">Go to Login</a>
        )}
      </form>
    </div>
  );
};

export default ResetPassword; 