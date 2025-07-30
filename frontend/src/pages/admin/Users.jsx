import React, { useEffect, useState, useRef } from 'react';
import { UserPlus, Edit, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight, Search, Eye } from 'lucide-react';
import { io } from 'socket.io-client';

const roles = ['admin', 'editor', 'custom'];
const allFeatures = ['Analytics', 'Leads', 'SEO', 'Team', 'Logs', 'Subscribers', 'Services'];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(API_URL, { autoConnect: false });

const statusColors = {
  active: 'bg-green-600',
  inactive: 'bg-gray-500',
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const mounted = useRef(false);

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/admin/verify-token`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
        }
      } catch {}
    };
    fetchCurrentUser();
  }, []);

  // Fetch real users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page,
        limit: perPage,
        search,
        sort: (sortDir === 'desc' ? '-' : '') + sortBy,
        role: roleFilter,
        status: statusFilter
      });
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/api/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        setTotal(data.total);
      } else {
        setUsers([]);
        setTotal(0);
        setError(data.message || 'Users unavailable');
      }
    } catch (e) {
      setUsers([]);
      setTotal(0);
      setError('Users unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page, perPage, search, sortBy, sortDir, roleFilter, statusFilter]);

  // Real-time updates
  useEffect(() => {
    if (!mounted.current) {
      socket.connect();
      mounted.current = true;
    }
    socket.on('userUpdate', (evt) => {
      fetchUsers();
    });
    return () => {
      socket.off('userUpdate');
    };
  }, []);

  const toggleSelect = (id) => {
    setSelectedUsers(selectedUsers.includes(id)
      ? selectedUsers.filter(uid => uid !== id)
      : [...selectedUsers, id]);
  };
  const toggleSelectAll = () => {
    if (users.every(user => selectedUsers.includes(user._id))) {
      setSelectedUsers(selectedUsers.filter(id => !users.some(u => u._id === id)));
    } else {
      setSelectedUsers([...new Set([...selectedUsers, ...users.map(u => u._id)])]);
    }
  };
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };
  const handleBulkStatus = async (status) => {
    const token = localStorage.getItem('admin_token');
    for (const id of selectedUsers) {
      await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
    }
    setSelectedUsers([]);
    fetchUsers();
  };
  const handleBulkDelete = async () => {
    const token = localStorage.getItem('admin_token');
    if (window.confirm('Are you sure you want to delete selected users?')) {
      for (const id of selectedUsers) {
        await fetch(`${API_URL}/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      setSelectedUsers([]);
      fetchUsers();
    }
  };
  const handleAdd = () => {
    setEditUser(null);
    setShowModal(true);
  };
  const handleEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };
  const handleSave = async (user) => {
    const token = localStorage.getItem('admin_token');
    if (editUser) {
      // Edit existing user
      await fetch(`${API_URL}/api/users/${editUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
    } else {
      // Add new user
      await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
    }
    setShowModal(false);
    setEditUser(null);
    fetchUsers();
  };
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2 sm:mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2"><UserPlus className="text-blue-500" /> Users</h1>
        {currentUser?.role === 'admin' && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleAdd} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded font-semibold transition text-xs sm:text-sm"><UserPlus className="w-4 h-4 mr-2" /> Add User</button>
          {selectedUsers.length > 0 && (
            <>
              <button onClick={() => handleBulkStatus('active')} className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-semibold transition text-xs"><CheckCircle className="w-4 h-4 mr-1" /> Activate</button>
              <button onClick={() => handleBulkStatus('inactive')} className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded font-semibold transition text-xs"><XCircle className="w-4 h-4 mr-1" /> Deactivate</button>
              <button onClick={handleBulkDelete} className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-semibold transition text-xs"><Trash2 className="w-4 h-4 mr-1" /> Delete</button>
            </>
          )}
        </div>
        )}
      </div>
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-8 pr-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          />
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="rounded px-2 py-2 bg-gray-800 text-white text-xs sm:text-sm focus:outline-none"
        >
          <option value="">All Roles</option>
          {roles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded px-2 py-2 bg-gray-800 text-white text-xs sm:text-sm focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      {/* Users Table */}
      <div className="bg-gray-900 rounded-xl shadow overflow-x-auto">
        <table className="min-w-[800px] w-full text-left text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap"><input type="checkbox" checked={users.length > 0 && users.every(user => selectedUsers.includes(user._id))} onChange={toggleSelectAll} className="accent-blue-600 w-4 h-4" /></th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap cursor-pointer" onClick={() => handleSort('name')}>Name {sortBy === 'name' && (sortDir === 'asc' ? '▲' : '▼')}</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap cursor-pointer" onClick={() => handleSort('email')}>Email {sortBy === 'email' && (sortDir === 'asc' ? '▲' : '▼')}</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap cursor-pointer" onClick={() => handleSort('role')}>Role {sortBy === 'role' && (sortDir === 'asc' ? '▲' : '▼')}</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap">Features</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap">Status</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="text-center py-8 text-red-400">{error}</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No users found.</td></tr>
            ) : users.map((user) => (
              <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-white font-medium whitespace-nowrap"><input type="checkbox" checked={selectedUsers.includes(user._id)} onChange={() => toggleSelect(user._id)} className="accent-blue-600 w-4 h-4" /></td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-white font-medium whitespace-nowrap">{user.name}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-blue-400 font-medium whitespace-nowrap">{user.email}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-300 font-medium whitespace-nowrap">{user.role}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 whitespace-nowrap truncate max-w-[120px]">{user.features.join(', ')}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3"><span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${statusColors[user.status]}`}>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-2">
                  <button onClick={() => { setShowDetail(user); }} className="bg-gray-800 hover:bg-blue-600 text-white rounded p-2 transition" title="View"><Eye className="w-4 h-4" /></button>
                  {currentUser?.role === 'admin' && <>
                    <button onClick={() => handleEdit(user)} className="bg-gray-800 hover:bg-green-600 text-white rounded p-2 transition" title="Edit"><Edit className="w-4 h-4" /></button>
                    <button onClick={async () => { const token = localStorage.getItem('admin_token'); if(window.confirm('Delete this user?')) { await fetch(`${API_URL}/api/users/${user._id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); fetchUsers(); } }} className="bg-gray-800 hover:bg-red-600 text-white rounded p-2 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-gray-400">
          Showing {users.length === 0 ? 0 : (page - 1) * perPage + 1} - {Math.min(page * perPage, total)} of {total} users
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1 rounded bg-gray-800 text-gray-300 hover:bg-blue-600 hover:text-white disabled:opacity-50"><ChevronLeft size={18} /></button>
          <span className="text-xs text-gray-300">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * perPage >= total} className="p-1 rounded bg-gray-800 text-gray-300 hover:bg-blue-600 hover:text-white disabled:opacity-50"><ChevronRight size={18} /></button>
        </div>
      </div>
      {/* Add/Edit User Modal */}
      {showModal && (
        <UserModal
          user={editUser}
          onClose={() => { setShowModal(false); setEditUser(null); }}
          onSave={handleSave}
        />
      )}
      {/* Details Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2">
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-md shadow-xl relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl" onClick={() => setShowDetail(null)}>×</button>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">User Details</h2>
            <div className="mb-2 text-gray-300 text-xs sm:text-sm"><span className="font-semibold">Name:</span> {showDetail.name}</div>
            <div className="mb-2 text-gray-300 text-xs sm:text-sm"><span className="font-semibold">Email:</span> {showDetail.email}</div>
            <div className="mb-2 text-gray-300 text-xs sm:text-sm"><span className="font-semibold">Role:</span> {showDetail.role}</div>
            <div className="mb-2 text-gray-300 text-xs sm:text-sm"><span className="font-semibold">Features:</span> {showDetail.features.join(', ')}</div>
            <div className="mb-2 text-gray-300 text-xs sm:text-sm"><span className="font-semibold">Status:</span> <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${statusColors[showDetail.status]}`}>{showDetail.status.charAt(0).toUpperCase() + showDetail.status.slice(1)}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.role || 'admin');
  const [features, setFeatures] = useState(user?.features || []);
  const [status, setStatus] = useState(user?.status || 'active');

  const handleFeatureToggle = (feature) => {
    setFeatures(features.includes(feature)
      ? features.filter(f => f !== feature)
      : [...features, feature]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || (user ? false : !password)) return;
    onSave({ name, email, password, role, features, status });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2">
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-md shadow-xl relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl" onClick={onClose} type="button">×</button>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">{user ? 'Edit User' : 'Add User'}</h2>
        <label className="block mb-2 font-medium text-gray-300">Name</label>
        <input className="w-full border px-3 py-2 rounded mb-4 bg-gray-800 text-white" value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" required />
        <label className="block mb-2 font-medium text-gray-300">Email</label>
        <input className="w-full border px-3 py-2 rounded mb-4 bg-gray-800 text-white" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" type="email" required />
        {!user && <>
          <label className="block mb-2 font-medium text-gray-300">Password</label>
          <input className="w-full border px-3 py-2 rounded mb-4 bg-gray-800 text-white" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" type="password" required />
        </>}
        <label className="block mb-2 font-medium text-gray-300">Role</label>
        <select className="w-full border px-3 py-2 rounded mb-4 bg-gray-800 text-white" value={role} onChange={e => setRole(e.target.value)}>
          {roles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
        <label className="block mb-2 font-medium text-gray-300">Features</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {allFeatures.map(f => (
            <button
              type="button"
              key={f}
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${features.includes(f) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-800 text-gray-300 border-gray-700'}`}
              onClick={() => handleFeatureToggle(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <label className="block mb-2 font-medium text-gray-300">Status</label>
        <select className="w-full border px-3 py-2 rounded mb-4 bg-gray-800 text-white" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="submit" className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" disabled={!name || !email || (!user && !password)}>{user ? 'Save Changes' : 'Add User'}</button>
      </form>
    </div>
  );
} 