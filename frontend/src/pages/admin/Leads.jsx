import React, { useEffect, useState } from 'react';
import { Mail, Eye, Download, CheckCircle, Clock, Loader2, Trash2, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-timestamp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page,
        limit,
        search,
        sort
      });
      const res = await fetch(`${API_URL}/api/leads?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.data);
        setTotal(data.total);
      } else {
        setLeads([]);
        setTotal(0);
        setError(data.message || 'Leads unavailable');
      }
    } catch (e) {
      setLeads([]);
      setTotal(0);
      setError('Leads unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line
  }, [page, limit, search, sort]);

  const handleStatusChange = (id, status) => {
    // This function is no longer needed as leads are fetched from backend
    // setLeads(leads.map(lead => lead.id === id ? { ...lead, status } : lead));
  };

  const handleExport = () => {
    alert('Exported as CSV (dummy)');
  };

  const handleBulkStatus = (status) => {
    // This function is no longer needed as leads are fetched from backend
    // setLeads(leads.map(lead => selectedLeads.includes(lead.id) ? { ...lead, status } : lead));
  };

  const handleBulkDelete = () => {
    if (window.confirm('Are you sure you want to delete selected leads?')) {
      // This function is no longer needed as leads are fetched from backend
      // setLeads(leads.filter(lead => !selectedLeads.includes(lead.id)));
      setLeads([]); // Clear leads on bulk delete
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this lead?')) {
      // This function is no longer needed as leads are fetched from backend
      // setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const toggleSelect = (id) => {
    // This function is no longer needed as leads are fetched from backend
    // setSelectedLeads(selectedLeads.includes(id)
    //   ? selectedLeads.filter(lid => lid !== id)
    //   : [...selectedLeads, id]);
  };

  const toggleSelectAll = () => {
    // This function is no longer needed as leads are fetched from backend
    // if (paginated.every(lead => selectedLeads.includes(lead.id))) {
    //   setSelectedLeads(selectedLeads.filter(id => !paginated.some(l => l.id === id)));
    // } else {
    //   setSelectedLeads([...new Set([...selectedLeads, ...paginated.map(l => l.id)])]);
    // }
  };

  const handleSort = (col) => {
    // This function is no longer needed as sort is handled by backend
    // if (sortBy === col) {
    //   setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    // } else {
    //   setSortBy(col);
    //   setSortDir('asc');
    // }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-2 py-1 rounded bg-gray-800 text-white"
        />
        <select value={sort} onChange={e => setSort(e.target.value)} className="px-2 py-1 rounded bg-gray-800 text-white">
          <option value="-timestamp">Newest</option>
          <option value="timestamp">Oldest</option>
        </select>
      </div>
      <table className="min-w-full bg-gray-900 rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-gray-400">Name</th>
            <th className="px-4 py-2 text-left text-gray-400">Email</th>
            <th className="px-4 py-2 text-left text-gray-400">Phone</th>
            <th className="px-4 py-2 text-left text-gray-400">Source</th>
            <th className="px-4 py-2 text-left text-gray-400">Time</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
          ) : error ? (
            <tr><td colSpan={5} className="text-center py-8 text-red-400">{error}</td></tr>
          ) : leads.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8 text-gray-400">No leads found.</td></tr>
          ) : leads.map(lead => (
            <tr key={lead._id} className="border-b border-gray-800 hover:bg-gray-800">
              <td className="px-4 py-2 text-sm text-white">{lead.name}</td>
              <td className="px-4 py-2 text-sm text-gray-300">{lead.email}</td>
              <td className="px-4 py-2 text-sm text-gray-300">{lead.phone || '-'}</td>
              <td className="px-4 py-2 text-sm text-gray-300">{lead.source || '-'}</td>
              <td className="px-4 py-2 text-sm text-gray-400">{(lead.createdAt || lead.timestamp) ? new Date(lead.createdAt || lead.timestamp).toLocaleString() : '-'}</td>
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

export default Leads; 