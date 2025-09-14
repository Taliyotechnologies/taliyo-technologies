import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Search, 
  Globe, 
  Target, 
  BarChart3, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';

const SEO = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rangeDays, setRangeDays] = useState(30);
  const [current, setCurrent] = useState(null);
  const [previous, setPrevious] = useState(null);

  const fetchSummary = async (days) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin/login', { replace: true });
        return;
      }
      const end = new Date();
      const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
      const prevEnd = new Date(start.getTime());
      const prevStart = new Date(prevEnd.getTime() - days * 24 * 60 * 60 * 1000);

      const query = (s, e) => new URLSearchParams({ start: s.toISOString(), end: e.toISOString() }).toString();

      const [resCurr, resPrev] = await Promise.all([
        fetch(`${API}/api/admin/analytics/summary?${query(start, end)}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/admin/analytics/summary?${query(prevStart, prevEnd)}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const currJson = await resCurr.json().catch(() => ({}));
      const prevJson = await resPrev.json().catch(() => ({}));
      if (!resCurr.ok || currJson.success === false) throw new Error(currJson.message || `Failed to load analytics (${resCurr.status})`);
      if (!resPrev.ok || prevJson.success === false) throw new Error(prevJson.message || `Failed to load analytics (${resPrev.status})`);
      setCurrent(currJson);
      setPrevious(prevJson);
    } catch (e) {
      setError(e.message || 'Something went wrong');
      setCurrent({ breakdowns: { sourceSummary: {}, byCountry: [], topPages: [], organic: 0 } });
      setPrevious({ breakdowns: { sourceSummary: {}, byCountry: [], topPages: [], organic: 0 } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(rangeDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeDays]);

  const pctChange = (curr, prev) => {
    const c = Number(curr || 0), p = Number(prev || 0);
    if (p === 0) return c > 0 ? '+100%' : '0%';
    const pct = Math.round(((c - p) / p) * 100);
    return `${pct >= 0 ? '+' : ''}${pct}%`;
  };

  const organicCurr = current?.breakdowns?.organic || 0;
  const organicPrev = previous?.breakdowns?.organic || 0;
  const directCurr = current?.breakdowns?.sourceSummary?.direct || 0;
  const directPrev = previous?.breakdowns?.sourceSummary?.direct || 0;
  const referralCurr = current?.breakdowns?.sourceSummary?.referral || 0;
  const referralPrev = previous?.breakdowns?.sourceSummary?.referral || 0;

  const topCountry = current?.breakdowns?.byCountry?.[0]?._id || '—';
  const topPages = current?.breakdowns?.topPages || [];

  const seoStats = [
    {
      title: 'Organic Traffic',
      value: organicCurr.toLocaleString(),
      change: pctChange(organicCurr, organicPrev),
      trend: organicCurr - organicPrev >= 0 ? 'up' : 'down',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Direct Traffic',
      value: directCurr.toLocaleString(),
      change: pctChange(directCurr, directPrev),
      trend: directCurr - directPrev >= 0 ? 'up' : 'down',
      icon: Search,
      color: 'bg-blue-500'
    },
    {
      title: 'Referral Traffic',
      value: referralCurr.toLocaleString(),
      change: pctChange(referralCurr, referralPrev),
      trend: referralCurr - referralPrev >= 0 ? 'up' : 'down',
      icon: Globe,
      color: 'bg-purple-500'
    },
    {
      title: 'Top Country',
      value: topCountry,
      change: '',
      trend: 'up',
      icon: Target,
      color: 'bg-orange-500'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
      case 'High':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200';
    }
  };

  const getSEOScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <>
      <Helmet>
        <title>SEO Management - Taliyo Technologies</title>
        <meta name="description" content="Manage SEO settings and track performance" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SEO Management</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Track and optimize your website's search performance</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  {[7, 30, 90].map(d => (
                    <button key={d} onClick={() => setRangeDays(d)} className={`px-3 py-2 text-sm ${rangeDays === d ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}>
                      {d}D
                    </button>
                  ))}
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Add Keyword</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="p-3 rounded border border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 mb-4">{error}</div>
          )}
          {loading && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Loading SEO analytics...</div>
          )}
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {seoStats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    {stat.change !== '' && (
                      <div className="flex items-center mt-2">
                        {getTrendIcon(stat.trend)}
                        <span className={`ml-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs previous</span>
                      </div>
                    )}
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', name: 'Overview' },
                  { id: 'keywords', name: 'Keywords' },
                  { id: 'pages', name: 'Pages' },
                  { id: 'settings', name: 'Settings' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Traffic Overview */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Traffic Overview</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">Organic Traffic</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{organicCurr.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">Direct Traffic</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{directCurr.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">Referral Traffic</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{referralCurr.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics (Real data requires PageSpeed API) */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Page Load Speed</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">N/A</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Mobile Score</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">N/A</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Desktop Score</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">N/A</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Core Web Vitals</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">N/A</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Connect Google PageSpeed Insights to show real performance metrics.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'keywords' && (
                <div className="p-6 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Connect Google Search Console</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    To display real keyword rankings and impressions, connect your site to Google Search Console and provide API access. This page currently shows real traffic data, but keyword-level insights require Search Console.
                  </p>
                </div>
              )}

              {activeTab === 'pages' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Pages (by Views)</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Page</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Views</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {(topPages || []).map((p, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{p._id || '—'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">{(p.count || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Google Analytics ID
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="GA-XXXXXXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Google Search Console
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://search.google.com/search-console"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sitemap URL
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://taliyotechnologies.com/sitemap.xml"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Robots.txt
                        </label>
                        <textarea
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="User-agent: *\nAllow: /\nDisallow: /admin/"
                        />
                      </div>
                      <div className="flex space-x-3 pt-4">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          Save Settings
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SEO; 