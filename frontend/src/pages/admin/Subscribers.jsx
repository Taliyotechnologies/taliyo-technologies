import React, { useEffect, useState, useRef } from 'react';
import { FaEnvelope, FaUserCheck } from 'react-icons/fa';
import { Download, CheckCircle, XCircle, Trash2, ChevronLeft, ChevronRight, Search, Eye } from 'lucide-react';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(API_URL, { autoConnect: false });

const statusColors = {
  active: 'bg-green-600',
  inactive: 'bg-gray-500',
};
const statusLabels = {
  active: 'Active',
  inactive: 'Inactive',
};

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('dateSubscribed');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mounted = useRef(false);

  // Fetch real subscribers
  const fetchSubscribers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page,
        limit: perPage,
        search,
        sort: (sortDir === 'desc' ? '-' : '') + sortBy,
        status: statusFilter
      });
      const res = await fetch(`${API_URL}/api/subscribers?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.data);
        setTotal(data.total);
      } else {
        setSubscribers([]);
        setTotal(0);
        setError(data.message || 'Subscribers unavailable');
      }
    } catch (e) {
      setSubscribers([]);
      setTotal(0);
      setError('Subscribers unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    // eslint-disable-next-line
  }, [page, perPage, search, sortBy, sortDir, statusFilter]);

  // Real-time updates
  useEffect(() => {
    if (!mounted.current) {
      socket.connect();
      mounted.current = true;
    }
    socket.on('subscriberUpdate', (evt) => {
      if (evt.type === 'add') {
        fetchSubscribers();
      } else if (evt.type === 'update') {
        fetchSubscribers();
      } else if (evt.type === 'delete') {
        fetchSubscribers();
      }
    });
    return () => {
      socket.off('subscriberUpdate');
    };
  }, []);

  const toggleSelect = (id) => {
    setSelectedSubs(selectedSubs.includes(id)
      ? selectedSubs.filter(sid => sid !== id)
      : [...selectedSubs, id]);
  };
  const toggleSelectAll = () => {
    if (subscribers.every(sub => selectedSubs.includes(sub._id))) {
      setSelectedSubs(selectedSubs.filter(id => !subscribers.some(s => s._id === id)));
    } else {
      setSelectedSubs([...new Set([...selectedSubs, ...subscribers.map(s => s._id)])]);
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
    for (const id of selectedSubs) {
      await fetch(`${API_URL}/api/subscribers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    }
    setSelectedSubs([]);
    fetchSubscribers();
  };
  const handleBulkDelete = async () => {
    if (window.confirm('Are you sure you want to delete selected subscribers?')) {
      for (const id of selectedSubs) {
        await fetch(`${API_URL}/api/subscribers/${id}`, { method: 'DELETE' });
      }
      setSelectedSubs([]);
      fetchSubscribers();
    }
  };
  const handleExport = () => {
    alert('Exported as CSV (real export coming soon)');
  };
  const handleSend = async () => {
    setSending(true);
    setFeedback('');
    // TODO: Implement real bulk email API
    setTimeout(() => {
      setSending(false);
      setFeedback('Bulk email sent to all subscribers!');
      setShowModal(false);
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Topbar: Search, Filter, Bulk Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2 sm:mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2"><FaUserCheck className="text-blue-500" /> Subscribers</h1>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleExport} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded font-semibold transition text-xs sm:text-sm"><Download className="w-4 h-4 mr-2" /> Export</button>
          <button onClick={() => setShowModal(true)} className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded font-semibold transition text-xs sm:text-sm"><FaEnvelope className="w-4 h-4 mr-2" /> Send Bulk Email</button>
          {selectedSubs.length > 0 && (
            <>
              <button onClick={() => handleBulkStatus('active')} className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-semibold transition text-xs"><CheckCircle className="w-4 h-4 mr-1" /> Activate</button>
              <button onClick={() => handleBulkStatus('inactive')} className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded font-semibold transition text-xs"><XCircle className="w-4 h-4 mr-1" /> Deactivate</button>
              <button onClick={handleBulkDelete} className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-semibold transition text-xs"><Trash2 className="w-4 h-4 mr-1" /> Delete</button>
            </>
          )}
        </div>
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
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded px-2 py-2 bg-gray-800 text-white text-xs sm:text-sm focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      {/* Subscribers Table */}
      <div className="bg-gray-900 rounded-xl shadow overflow-x-auto">
        <table className="min-w-[700px] w-full text-left text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap"><input type="checkbox" checked={subscribers.length > 0 && subscribers.every(sub => selectedSubs.includes(sub._id))} onChange={toggleSelectAll} className="accent-blue-600 w-4 h-4" /></th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap cursor-pointer" onClick={() => handleSort('name')}>Name {sortBy === 'name' && (sortDir === 'asc' ? '▲' : '▼')}</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap">Email</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap cursor-pointer" onClick={() => handleSort('dateSubscribed')}>Date {sortBy === 'dateSubscribed' && (sortDir === 'asc' ? '▲' : '▼')}</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap cursor-pointer" onClick={() => handleSort('status')}>Status {sortBy === 'status' && (sortDir === 'asc' ? '▲' : '▼')}</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 font-semibold whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="text-center py-8 text-red-400">{error}</td></tr>
            ) : subscribers.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No subscribers found.</td></tr>
            ) : subscribers.map((sub) => (
              <tr key={sub._id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-white font-medium whitespace-nowrap"><input type="checkbox" checked={selectedSubs.includes(sub._id)} onChange={() => toggleSelect(sub._id)} className="accent-blue-600 w-4 h-4" /></td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-white font-medium whitespace-nowrap">{sub.name}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-blue-400 font-medium whitespace-nowrap">{sub.email}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-400 whitespace-nowrap">{sub.dateSubscribed ? new Date(sub.dateSubscribed).toLocaleDateString() : '-'}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${statusColors[sub.status]}`}>{statusLabels[sub.status]}</span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-2">
                  <button onClick={() => { setShowDetail(sub); }} className="bg-gray-800 hover:bg-blue-600 text-white rounded p-2 transition" title="View"><Eye className="w-4 h-4" /></button>
                  <button onClick={async () => { if(window.confirm('Delete this subscriber?')) { await fetch(`${API_URL}/api/subscribers/${sub._id}`, { method: 'DELETE' }); fetchSubscribers(); } }} className="bg-gray-800 hover:bg-red-600 text-white rounded p-2 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-gray-400">
          Showing {subscribers.length === 0 ? 0 : (page - 1) * perPage + 1} - {Math.min(page * perPage, total)} of {total} subscribers
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1 rounded bg-gray-800 text-gray-300 hover:bg-blue-600 hover:text-white disabled:opacity-50"><ChevronLeft size={18} /></button>
          <span className="text-xs text-gray-300">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * perPage >= total} className="p-1 rounded bg-gray-800 text-gray-300 hover:bg-blue-600 hover:text-white disabled:opacity-50"><ChevronRight size={18} /></button>
        </div>
      </div>
      {/* Bulk Email Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-2">
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-md shadow-xl relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl" onClick={() => setShowModal(false)}>×</button>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Send Bulk Email</h2>
            <label className="block mb-2 font-medium text-gray-300">Subject</label>
            <input className="w-full border px-3 py-2 rounded mb-4 bg-gray-800 text-white" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Enter email subject" />
            <label className="block mb-2 font-medium text-gray-300">Message</label>
            <textarea className="w-full border px-3 py-2 rounded mb-4 bg-gray-800 text-white" rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message here..." />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setShowModal(false)} disabled={sending}>Cancel</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleSend} disabled={sending || !subject || !message}>{sending ? 'Sending...' : 'Send'}</button>
            </div>
            {feedback && <div className="mt-4 text-green-400 font-semibold">{feedback}</div>}
          </div>
        </div>
      )}
      {/* Details Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2">
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-md shadow-xl relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl" onClick={() => setShowDetail(null)}>×</button>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Subscriber Details</h2>
            <div className="mb-2 text-gray-300 text-xs sm:text-sm"><span className="font-semibold">Name:</span> {showDetail.name}</div>
            <div className="mb-2 text-gray-300 text-xs sm:text-sm"><span className="font-semibold">Email:</span> {showDetail.email}</div>
            <div className="mb-2 text-gray-300 text-xs sm:text-sm"><span className="font-semibold">Date:</span> {showDetail.dateSubscribed ? new Date(showDetail.dateSubscribed).toLocaleDateString() : '-'}</div>
            <div className="mb-2 text-gray-300 text-xs sm:text-sm"><span className="font-semibold">Status:</span> <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${statusColors[showDetail.status]}`}>{statusLabels[showDetail.status]}</span></div>
          </div>
        </div>
      )}
    </div>
  );
} 