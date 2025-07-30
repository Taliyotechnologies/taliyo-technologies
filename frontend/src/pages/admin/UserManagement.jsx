import React, { useState, useEffect } from 'react';
import { FaTrash, FaUserPlus, FaEdit, FaSearch } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PROJECTS = [
  'Website Redesign',
  'Mobile App',
  'AI Chatbot',
  'Cloud Migration',
  'Ecommerce Platform',
  'SEO Optimization',
  'Custom CRM',
];
const initialForm = { name: '', email: '', password: '', role: 'viewer' };

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const token = localStorage.getItem('adminToken');
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const user = JSON.parse(localStorage.getItem('admin_user'));

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API}/api/admin/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (!search) setFilteredUsers(users);
    else {
      setFilteredUsers(
        users.filter(u =>
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          (u.role && u.role.toLowerCase().includes(search.toLowerCase()))
        )
      );
    }
  }, [search, users]);

  const openAddModal = () => {
    setForm(initialForm);
    setEditId(null);
    setModalOpen(true);
    setError('');
    setMessage('');
  };

  const openEditModal = (user) => {
    setForm({
      name: user.name || '',
      email: user.email,
      password: '',
      role: user.role || 'viewer',
    });
    setEditId(user._id);
    setModalOpen(true);
    setError('');
    setMessage('');
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
    setForm(initialForm);
  };

  const handleFormChange = e => {
    const { name, value, type, selectedOptions } = e.target;
    if (name === 'assignedProjects') {
      const values = Array.from(selectedOptions).map(opt => opt.value);
      setForm(f => ({ ...f, assignedProjects: values }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setMessage('');
    if (!form.email || (!editId && !form.password)) return setError('Email and password required');
    setLoading(true);
    try {
      let res, data;
      if (editId) {
        res = await fetch(`${API}/api/admin/auth/users/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update user');
        setMessage('User updated');
        showToast('success', 'User updated successfully');
      } else {
        res = await fetch(`${API}/api/admin/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to add user');
        setMessage('User added');
        showToast('success', 'User added successfully');
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      setError(err.message);
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    setError(''); setMessage('');
    try {
      const res = await fetch(`${API}/api/admin/auth/users/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');
      setMessage('User deleted');
      showToast('success', 'User deleted successfully');
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      setError(err.message);
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow p-6 mb-8 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all duration-300
          ${toast.type === 'success' ? 'bg-green-600' : ''}
          ${toast.type === 'error' ? 'bg-red-600' : ''}
        `}>
          {toast.message}
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-semibold">User Management</h2>
        {user?.role === 'admin' && (
          <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
            <FaUserPlus /> Add User
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by email or role..."
            className="w-full p-2 pl-9 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-2 top-3 text-gray-400" />
        </div>
      </div>
      {message && <div className="mb-2 text-green-400 font-medium">{message}</div>}
      {error && <div className="mb-2 text-red-400 font-medium">{error}</div>}
      {fetching ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Created</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-400">No users found.</td></tr>
              ) : filteredUsers.map(u => (
                <tr key={u._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-2 px-4">{u.name || <span className="text-gray-500 italic">No name</span>}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4 capitalize">{u.role}</td>
                  <td className="py-2 px-4">{new Date(u.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4 flex gap-2">
                    {user?.role === 'admin' && (
                      <>
                        <button onClick={() => openEditModal(u)} className="text-blue-400 hover:underline flex items-center gap-1"><FaEdit />Edit</button>
                        <button onClick={() => setDeleteId(u._id)} className="text-red-400 hover:underline flex items-center gap-1"><FaTrash />Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl">&times;</button>
            <h3 className="text-xl font-semibold mb-4">{editId ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Name</label>
                <input type="text" name="name" className="w-full p-2 rounded bg-gray-800 text-white" value={form.name} onChange={handleFormChange} placeholder="Full Name" disabled={user?.role !== 'admin'} />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input type="email" name="email" className="w-full p-2 rounded bg-gray-800 text-white" value={form.email} onChange={handleFormChange} required disabled={user?.role !== 'admin'} />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Password {editId && <span className="text-xs text-gray-400">(leave blank to keep unchanged)</span>}</label>
                <input type="password" name="password" className="w-full p-2 rounded bg-gray-800 text-white" value={form.password} onChange={handleFormChange} placeholder={editId ? '••••••••' : ''} required={!editId} disabled={user?.role !== 'admin'} />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Role</label>
                <select name="role" value={form.role} onChange={handleFormChange} className="w-full p-2 rounded bg-gray-800 text-white" disabled={user?.role !== 'admin'}>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                  <option value="hr">HR</option>
                </select>
              </div>
              {user?.role === 'admin' && (
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>{loading ? (editId ? 'Updating...' : 'Adding...') : (editId ? 'Update User' : 'Add User')}</button>
              )}
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-sm relative">
            <h3 className="text-lg font-semibold mb-4 text-red-400">Confirm Delete</h3>
            <p className="mb-6 text-gray-300">Are you sure you want to delete this user?</p>
            <div className="flex gap-4">
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
              <button onClick={() => setDeleteId(null)} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 