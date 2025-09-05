import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin/login', { replace: true });
          return;
        }
        const res = await fetch(`${API}/api/admin/contacts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) {
          navigate('/admin/login', { replace: true });
          return;
        }
        const data = await res.json();
        if (!res.ok || data.success === false) throw new Error(data.message || 'Failed to load contacts');
        setContacts(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        setError(e.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [navigate]);

  useEffect(() => {
    try {
      if (!socketRef.current) {
        socketRef.current = io(API, { transports: ['websocket'], autoConnect: true });
        socketRef.current.on('newContact', (payload) => {
          const item = payload?.item || payload;
          if (!item) return;
          setContacts(prev => {
            // Prevent duplicates by _id
            if (prev.some(c => c._id === item._id)) return prev;
            return [item, ...prev];
          });
        });
      }
    } catch (e) {
      // ignore socket errors
    }
    return () => {
      try {
        if (socketRef.current) {
          socketRef.current.off('newContact');
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      } catch {}
    };
  }, []);

  const filtered = contacts.filter(c => {
    const q = searchTerm.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q) ||
      (c.service || '').toLowerCase().includes(q) ||
      (c.subject || '').toLowerCase().includes(q)
    );
  });

  const handleToggleStatus = async (c) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin/login', { replace: true });
        return;
      }
      const nextStatus = c.status === 'done' ? 'not done' : 'done';
      const res = await fetch(`${API}/api/admin/contacts/${c._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || 'Failed to update status');
      setContacts(prev => prev.map(x => x._id === c._id ? { ...x, status: nextStatus } : x));
    } catch (e) {
      setError(e.message || 'Something went wrong');
    }
  };

  const exportCSV = () => {
    const headers = ['Name','Email','Phone','Company','Service','Subject','Status','Received'];
    const rows = filtered.map(c => [
      c.name || '',
      c.email || '',
      c.phone || '',
      c.company || '',
      c.service || '',
      c.subject || '',
      c.status || '',
      c.createdAt ? new Date(c.createdAt).toISOString() : ''
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Contacts - Taliyo Admin</title>
      </Helmet>

      <div className="min-h-screen">
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Incoming contact form submissions (live)</p>
              </div>
              <div className="flex w-full sm:w-auto gap-3 items-center">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
                <button
                  onClick={exportCSV}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="p-3 rounded border border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 mb-4">
              {error}
            </div>
          )}
          {loading && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Loading contacts...</div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/40">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-blue-600 dark:text-blue-400">
                      <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{c.company || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{c.service || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 truncate max-w-[240px]" title={c.subject}>{c.subject || '—'}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={`px-2 py-1 rounded-full font-medium ${c.status === 'done' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                        {c.status || 'not done'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}</td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className={`px-3 py-1 rounded-lg border text-xs ${c.status === 'done' ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100' : 'bg-green-600 text-white border-green-700'}`}
                      >
                        {c.status === 'done' ? 'Mark Not Done' : 'Mark Done'}
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No contacts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;
