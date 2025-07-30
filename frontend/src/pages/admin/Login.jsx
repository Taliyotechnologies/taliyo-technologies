import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('harshbudhauliya882@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Login failed');
      } else {
        localStorage.setItem('adminToken', data.token);
        window.location.href = '/admin/analytics';
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/95 shadow-2xl rounded-2xl p-10 w-full max-w-md flex flex-col gap-7 border border-gray-800"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-400 tracking-tight">Admin Login</h2>
        <div>
          <label className="block text-gray-200 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800 placeholder-gray-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-gray-200 font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800 placeholder-gray-500 pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
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
          <div className="flex justify-end mt-1">
            <a
              href="/admin/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-200 font-medium underline transition"
            >
              Forgot password?
            </a>
          </div>
        </div>
        {error && <div className="text-red-400 text-center text-sm font-medium">{error}</div>}
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-bold py-2 rounded-lg shadow-md transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login; 