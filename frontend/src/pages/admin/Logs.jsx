import React, { useEffect, useState } from 'react';
import { AlertCircle, Info, CheckCircle, XCircle, Loader2, Download, Search, Eye, Trash2, ChevronLeft, ChevronRight, BarChart2, Bell } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [sort, setSort] = useState('-timestamp');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        search,
        level,
        sort
      });
      const res = await fetch(`${API_URL}/api/logs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        setTotal(data.total);
      }
    } catch (e) {
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [page, limit, search, level, sort]);

  // Filter, search, sort
  let filtered = logs.filter(l =>
    (l.message.toLowerCase().includes(search.toLowerCase()) ||
      l.page.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase())) &&
    (level ? l.level === level : true)
  );
  filtered = filtered.sort((a, b) => {
    if (sort === 'timestamp') return sortDir === 'asc' ? a.timestamp.localeCompare(b.timestamp) : b.timestamp.localeCompare(a.timestamp);
    if (sort === 'level') return sortDir === 'asc' ? a.level.localeCompare(b.level) : b.level.localeCompare(a.level);
    return 0;
  });
  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Actions
  const handleStatusChange = (id, status) => {
    setLogs(logs.map(l => l.id === id ? { ...l, status } : l));
  };
  const handleBulkStatus = (status) => {
    setLogs(logs.map(l => selectedLogs.includes(l.id) ? { ...l, status } : l));
  };
  const handleBulkDelete = () => {
    if (window.confirm('Delete selected logs?')) {
      setLogs(logs.filter(l => !selectedLogs.includes(l.id)));
      setSelectedLogs([]);
    }
  };
  const handleDelete = (id) => {
    if (window.confirm('Delete this log?')) {
      setLogs(logs.filter(l => l.id !== id));
    }
  };
  const toggleSelect = (id) => {
    setSelectedLogs(selectedLogs.includes(id)
      ? selectedLogs.filter(lid => lid !== id)
      : [...selectedLogs, id]);
  };
  const toggleSelectAll = () => {
    if (paginated.every(log => selectedLogs.includes(log.id))) {
      setSelectedLogs(selectedLogs.filter(id => !paginated.some(l => l.id === id)));
    } else {
      setSelectedLogs([...new Set([...selectedLogs, ...paginated.map(l => l.id)])]);
    }
  };
  const handleSort = (col) => {
    if (sortBy === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };
  const handleExport = () => {
    alert('Exported logs as CSV (dummy)');
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <select value={level} onChange={e => setLevel(e.target.value)} className="px-2 py-1 rounded bg-gray-800 text-white">
          <option value="">All Levels</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="px-2 py-1 rounded bg-gray-800 text-white">
          <option value="-timestamp">Newest</option>
          <option value="timestamp">Oldest</option>
        </select>
      </div>
      <table className="min-w-full bg-gray-900 rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-gray-400">Level</th>
            <th className="px-4 py-2 text-left text-gray-400">Message</th>
            <th className="px-4 py-2 text-left text-gray-400">User</th>
            <th className="px-4 py-2 text-left text-gray-400">IP</th>
            <th className="px-4 py-2 text-left text-gray-400">Time</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
          ) : logs.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8 text-gray-400">No logs found.</td></tr>
          ) : logs.map(log => (
            <tr key={log._id} className="border-b border-gray-800 hover:bg-gray-800">
              <td className="px-4 py-2 text-sm">
                <span className={
                  log.level === 'error' ? 'text-red-400' :
                  log.level === 'warn' ? 'text-yellow-400' :
                  'text-blue-400'
                }>{log.level}</span>
              </td>
              <td className="px-4 py-2 text-sm text-white">{log.message}</td>
              <td className="px-4 py-2 text-sm text-gray-300">{log.userId || '-'}</td>
              <td className="px-4 py-2 text-sm text-gray-300">{log.ip || '-'}</td>
              <td className="px-4 py-2 text-sm text-gray-400">{log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <div className="text-gray-400 text-sm">Total: {total}</div>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-2 py-1 bg-gray-800 text-white rounded disabled:opacity-50">Prev</button>
          <span className="text-gray-300">Page {page}</span>
          <button disabled={page * limit >= total} onClick={() => setPage(p => p + 1)} className="px-2 py-1 bg-gray-800 text-white rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Logs; 