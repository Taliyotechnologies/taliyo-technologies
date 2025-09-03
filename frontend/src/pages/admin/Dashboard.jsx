import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  MessageSquare
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [changes, setChanges] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fmt = (n) => typeof n === 'number' ? n.toLocaleString() : '0';
  const fmtChange = (v) => typeof v === 'number' ? `${v >= 0 ? '+' : ''}${v}%` : '0%';

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          navigate('/admin/login', { replace: true });
          return;
        }
        const res = await fetch(`${API}/api/admin/dashboard/summary`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.status === 401) {
          setError('Session expired. Please login again.');
          navigate('/admin/login', { replace: true });
          return;
        }
        const data = await res.json();
        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'Failed to load dashboard summary');
        }
        setSummary(data.summary || null);
        setChanges(data.changes || null);
        setRecentActivities(Array.isArray(data.recentActivities) ? data.recentActivities : []);
      } catch (e) {
        setError(e.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [navigate]);

  const stats = [
    {
      title: 'Subscribers',
      value: fmt(summary?.totalSubscribers ?? 0),
      change: fmtChange(changes?.subscribers ?? 0),
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Contact Requests',
      value: fmt(summary?.totalContacts ?? 0),
      change: fmtChange(changes?.contacts ?? 0),
      icon: MessageSquare,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Blogs',
      value: fmt(summary?.totalBlogs ?? 0),
      change: fmtChange(changes?.blogs ?? 0),
      icon: FileText,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Page Views',
      value: fmt(summary?.totalPageViews ?? 0),
      change: fmtChange(changes?.pageViews ?? 0),
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  // recentActivities is populated from API

  const quickActions = [
    {
      title: 'Add New Project',
      description: 'Create a new project',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/admin/projects/new'
    },
    {
      title: 'Manage Team',
      description: 'Add or edit team members',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600',
      href: '/admin/team'
    },
    {
      title: 'SEO Settings',
      description: 'Configure SEO settings',
      icon: TrendingUp,
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/admin/seo'
    },
    {
      title: 'Blog Management',
      description: 'Create or edit blog posts',
      icon: MessageSquare,
      color: 'bg-orange-500 hover:bg-orange-600',
      href: '/admin/blog'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Taliyo Technologies</title>
        <meta name="description" content="Admin dashboard for Taliyo Technologies" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Welcome back! Here's what's happening today.</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last updated</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Just now</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {error && (
            <div className="p-3 rounded border border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
          {loading && (
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard data...</div>
          )}
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.title}</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
                      <p className="text-sm text-green-600">{item.change}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <a
                    key={idx}
                    href={action.href}
                    className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow transition"
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${action.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <ul className="space-y-4">
                {recentActivities.map((a) => (
                  <li key={a.id || a._id} className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{a.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{a.details || a.description}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 