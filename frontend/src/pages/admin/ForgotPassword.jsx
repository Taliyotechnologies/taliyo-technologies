import React, { useState } from 'react';
import { Mail, TestTube } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('harshbudhauliya882@gmail.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [testEmailLoading, setTestEmailLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      console.log('Sending forgot password request for:', email);
      
      const res = await fetch(`${API_URL}/api/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      console.log('Forgot password response status:', res.status);
      
      const data = await res.json();
      console.log('Forgot password response:', data);
      
      if (!data.success) {
        setError(data.message || 'Failed to send reset email');
      } else {
        setSuccess('Reset link sent! Check your email.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const testEmail = async () => {
    setTestEmailLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Testing email configuration...');
      
      const res = await fetch(`${API_URL}/api/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email })
      });
      
      console.log('Test email response status:', res.status);
      
      const data = await res.json();
      console.log('Test email response:', data);
      
      if (!data.success) {
        setError(`Test email failed: ${data.message}`);
      } else {
        setSuccess('Test email sent successfully! Check your inbox.');
      }
    } catch (err) {
      console.error('Test email error:', err);
      setError('Failed to send test email.');
    } finally {
      setTestEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/95 shadow-2xl rounded-2xl p-10 w-full max-w-md flex flex-col gap-7 border border-gray-800"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-400 tracking-tight">Forgot Password</h2>
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
        {error && <div className="text-red-400 text-center text-sm font-medium">{error}</div>}
        {success && <div className="text-green-400 text-center text-sm font-medium">{success}</div>}
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-bold py-2 rounded-lg shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? 'Sending...' : <Mail size={16} />}
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          
          <button
            type="button"
            onClick={testEmail}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg shadow-md transition disabled:opacity-60 flex items-center justify-center"
            disabled={testEmailLoading}
            title="Test email configuration"
          >
            {testEmailLoading ? 'Testing...' : <TestTube size={16} />}
          </button>
        </div>
        
        <div className="text-xs text-gray-400 text-center">
          <p>If you're having trouble, try the test button to verify email configuration.</p>
          <p>Check the browser console for detailed logs.</p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword; 