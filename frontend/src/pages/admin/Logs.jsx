import React, { useState, useEffect } from 'react';
import { Activity, Clock, User, Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLogs(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to fetch logs');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getLogIcon = (action) => {
    if (action.includes('login') || action.includes('logout')) return <User className="w-4 h-4" />;
    if (action.includes('error')) return <XCircle className="w-4 h-4" />;
    if (action.includes('success')) return <CheckCircle className="w-4 h-4" />;
    return <Info className="w-4 h-4" />;
  };

  const getLogColor = (action) => {
    if (action.includes('error')) return 'text-red-400';
    if (action.includes('success')) return 'text-green-400';
    if (action.includes('login') || action.includes('logout')) return 'text-blue-400';
    return 'text-gray-400';
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'errors') return log.action?.includes('error') || log.details?.includes('error');
    if (filter === 'auth') return log.action?.includes('login') || log.action?.includes('logout');
    if (filter === 'admin') return log.action?.includes('admin') || log.user?.includes('admin');
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading logs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button 
            onClick={fetchLogs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="text-blue-400 w-6 h-6" />
          <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            {filteredLogs.length} entries
          </span>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Logs</option>
            <option value="errors">Errors Only</option>
            <option value="auth">Authentication</option>
            <option value="admin">Admin Actions</option>
          </select>
          
          <button
            onClick={fetchLogs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-gray-900 rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getLogIcon(log.action)}
                        <span className={`font-medium ${getLogColor(log.action)}`}>
                          {log.action || 'Unknown Action'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {log.user || 'System'}
                    </td>
                    <td className="px-6 py-4 text-gray-300 max-w-xs truncate">
                      {log.details || 'No details available'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                      {log.ip || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Total Logs</div>
              <div className="text-white font-bold text-xl">{logs.length}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Errors</div>
              <div className="text-white font-bold text-xl">
                {logs.filter(log => log.action?.includes('error')).length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Success</div>
              <div className="text-white font-bold text-xl">
                {logs.filter(log => log.action?.includes('success')).length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Auth Events</div>
              <div className="text-white font-bold text-xl">
                {logs.filter(log => log.action?.includes('login') || log.action?.includes('logout')).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs; 