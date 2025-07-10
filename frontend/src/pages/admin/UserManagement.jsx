import React, { useState, useEffect } from 'react';
import { FaTrash, FaUserPlus, FaCrown, FaUser } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('admin_token');

  const fetchUsers = async () => {
    const res = await fetch(`${API}/api/admin/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (!email || !password) return setError('Email and password required');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add user');
      setMessage('User added');
      setEmail(''); setPassword(''); setRole('user');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    const res = await fetch(`${API}/api/admin/auth/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) fetchUsers();
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      {message && <div className="mb-2 text-green-400">{message}</div>}
      {error && <div className="mb-2 text-red-400">{error}</div>}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6 flex-wrap">
        <input type="email" placeholder="Email" className="p-2 rounded bg-gray-800 text-white" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="p-2 rounded bg-gray-800 text-white" value={password} onChange={e => setPassword(e.target.value)} required />
        <select value={role} onChange={e => setRole(e.target.value)} className="p-2 rounded bg-gray-800 text-white">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>{loading ? 'Adding...' : 'Add User'}</button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Created</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4">{u.role}</td>
                <td className="py-2 px-4">{new Date(u.createdAt).toLocaleString()}</td>
                <td className="py-2 px-4">
                  <button onClick={() => handleDelete(u._id)} className="text-red-400 hover:underline mr-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement; 