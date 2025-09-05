import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  MousePointerClick,
  MonitorSmartphone,
  Smartphone,
  Globe,
  BarChart3,
  Calendar,
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';

const rangeOptions = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [rangeDays, setRangeDays] = useState(30);

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
      const params = new URLSearchParams({ start: start.toISOString(), end: end.toISOString() });
      const res = await fetch(`${API}/api/admin/analytics/summary?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        navigate('/admin/login', { replace: true });
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        throw new Error(json.message || `Failed to load analytics (${res.status})`);
      }
      setData(json);
    } catch (e) {
      setError(e.message || 'Something went wrong');
      // Fallback empty dataset so UI still renders
      setData({
        success: true,
        dbConfigured: false,
        summary: { totalVisitors: 0, totalPageViews: 0 },
        breakdowns: {
          byDevice: [], byCountry: [], byCity: [], inStates: [], usStates: [],
          sources: [], social: [], topReferrers: [], topPages: [], organic: 0, nonOrganic: 0
        },
        timeseries: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(rangeDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeDays]);

  const totals = useMemo(() => ({
    visitors: data?.summary?.totalVisitors || 0,
    pageViews: data?.summary?.totalPageViews || 0,
  }), [data]);

  const timeseriesChart = useMemo(() => {
    const labels = (data?.timeseries || []).map(d => d._id);
    const points = (data?.timeseries || []).map(d => d.count);
    return {
      labels,
      datasets: [
        {
          label: 'Page Views',
          data: points,
          borderColor: 'rgba(59,130,246,0.9)',
          backgroundColor: 'rgba(59,130,246,0.2)',
          tension: 0.3,
          fill: true,
        }
      ]
    };
  }, [data]);

  const deviceChart = useMemo(() => {
    const arr = data?.breakdowns?.byDevice || [];
    const labels = arr.map(x => x._id || 'unknown');
    const counts = arr.map(x => x.count);
    const colors = ['#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];
    return {
      labels,
      datasets: [{
        label: 'Devices',
        data: counts,
        backgroundColor: labels.map((_, i) => colors[i % colors.length])
      }]
    }
  }, [data]);

  const sourcesChart = useMemo(() => {
    const arr = data?.breakdowns?.sources || [];
    const labels = arr.map(x => x._id || 'unknown');
    const counts = arr.map(x => x.count);
    const colors = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#14b8a6'];
    return {
      labels,
      datasets: [{
        label: 'Sources',
        data: counts,
        backgroundColor: labels.map((_, i) => colors[i % colors.length])
      }]
    }
  }, [data]);

  const socialChart = useMemo(() => {
    const arr = data?.breakdowns?.social || [];
    return {
      labels: arr.map(x => x._id || 'other'),
      datasets: [{
        label: 'Social Visits',
        data: arr.map(x => x.count),
        backgroundColor: '#60a5fa'
      }]
    }
  }, [data]);

  const countriesChart = useMemo(() => {
    const arr = data?.breakdowns?.byCountry || [];
    return {
      labels: arr.map(x => x._id || 'Unknown'),
      datasets: [{
        label: 'Country Views',
        data: arr.map(x => x.count),
        backgroundColor: '#34d399'
      }]
    }
  }, [data]);

  const sourceSummary = useMemo(() => ({
    direct: data?.breakdowns?.sourceSummary?.direct || 0,
    google: data?.breakdowns?.sourceSummary?.google || 0,
    googleOrganic: data?.breakdowns?.sourceSummary?.googleOrganic || 0,
    googlePaid: data?.breakdowns?.sourceSummary?.googlePaid || 0,
    linkedin: data?.breakdowns?.sourceSummary?.linkedin || 0,
    instagram: data?.breakdowns?.sourceSummary?.instagram || 0,
    facebook: data?.breakdowns?.sourceSummary?.facebook || 0,
    twitter: data?.breakdowns?.sourceSummary?.twitter || 0,
    otherSocial: data?.breakdowns?.sourceSummary?.otherSocial || 0,
    referral: data?.breakdowns?.sourceSummary?.referral || 0,
    email: data?.breakdowns?.sourceSummary?.email || 0,
    paid: data?.breakdowns?.sourceSummary?.paid || 0,
  }), [data]);

  const tableRows = (items, valueKey = 'count') => (items || []).map((x, idx) => (
    <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50">
      <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200">{x._id || '—'}</td>
      <td className="px-3 py-2 text-sm text-gray-900 dark:text-white text-right">{x[valueKey]?.toLocaleString?.() ?? x[valueKey]}</td>
    </tr>
  ));

  return (
    <>
      <Helmet>
        <title>Analytics - Taliyo Admin</title>
      </Helmet>

      <div className="min-h-screen">
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Visitors, devices, geography, sources and more</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                {rangeOptions.map(opt => (
                  <button
                    key={opt.days}
                    onClick={() => setRangeDays(opt.days)}
                    className={`px-3 py-2 text-sm rounded-lg border ${rangeDays === opt.days ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {error && (
            <div className="p-3 rounded border border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
          {loading && (
            <div className="text-sm text-gray-500 dark:text-gray-400">Loading analytics...</div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Visitors</p>
                  <p className="text-3xl font-semibold text-gray-900 dark:text-white">{totals.visitors.toLocaleString()}</p>
                </div>
                <Users className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Page Views</p>
                  <p className="text-3xl font-semibold text-gray-900 dark:text-white">{totals.pageViews.toLocaleString()}</p>
                </div>
                <MousePointerClick className="w-10 h-10 text-green-500" />
              </div>
            </div>
          </div>

          {/* Timeseries */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Page Views Over Time</h2>
            <Line data={timeseriesChart} options={{ plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(107,114,128,0.15)' } } } }} />
          </div>

          {/* Devices + Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Devices</h2>
                <MonitorSmartphone className="w-5 h-5 text-gray-500" />
              </div>
              <Doughnut data={deviceChart} options={{ plugins: { legend: { position: 'bottom' } } }} />
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Traffic Sources</h2>
                <BarChart3 className="w-5 h-5 text-gray-500" />
              </div>
              <Doughnut data={sourcesChart} options={{ plugins: { legend: { position: 'bottom' } } }} />
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-green-600 dark:text-green-400">Organic</span>: {(data?.breakdowns?.organic ?? 0).toLocaleString()} •
                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">Non-Organic</span>: {(data?.breakdowns?.nonOrganic ?? 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Countries + Social */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Countries</h2>
                <Globe className="w-5 h-5 text-gray-500" />
              </div>
              <Bar data={countriesChart} options={{ plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(107,114,128,0.15)' } } } }} />
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Social Networks</h2>
                <Smartphone className="w-5 h-5 text-gray-500" />
              </div>
              <Bar data={socialChart} options={{ plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(107,114,128,0.15)' } } } }} />
            </div>
          </div>

          {/* Source Overview */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Source Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                <p className="text-xs text-gray-500">Direct</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{sourceSummary.direct.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                <p className="text-xs text-gray-500">Google</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{sourceSummary.google.toLocaleString()}</p>
                <p className="text-[11px] text-gray-500">Organic: {sourceSummary.googleOrganic.toLocaleString()} • Paid: {sourceSummary.googlePaid.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                <p className="text-xs text-gray-500">LinkedIn</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{sourceSummary.linkedin.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                <p className="text-xs text-gray-500">Instagram</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{sourceSummary.instagram.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                <p className="text-xs text-gray-500">Facebook</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{sourceSummary.facebook.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                <p className="text-xs text-gray-500">Twitter/X</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{sourceSummary.twitter.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                <p className="text-xs text-gray-500">Other Social</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{sourceSummary.otherSocial.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                <p className="text-xs text-gray-500">Referral</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{sourceSummary.referral.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{sourceSummary.email.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                <p className="text-xs text-gray-500">Paid (All)</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{sourceSummary.paid.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* States + Referrers + Pages + Cities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">India - Top States</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500">
                    <th className="px-3 py-2">State</th>
                    <th className="px-3 py-2 text-right">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows(data?.breakdowns?.inStates)}
                </tbody>
              </table>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">USA - Top States</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500">
                    <th className="px-3 py-2">State</th>
                    <th className="px-3 py-2 text-right">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows(data?.breakdowns?.usStates)}
                </tbody>
              </table>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Top Referrers</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500">
                    <th className="px-3 py-2">Referrer</th>
                    <th className="px-3 py-2 text-right">Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows(data?.breakdowns?.topReferrers)}
                </tbody>
              </table>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Top Pages</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500">
                    <th className="px-3 py-2">Page</th>
                    <th className="px-3 py-2 text-right">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows(data?.breakdowns?.topPages)}
                </tbody>
              </table>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 lg:col-span-2">
              <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Top Cities</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500">
                    <th className="px-3 py-2">City</th>
                    <th className="px-3 py-2 text-right">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows(data?.breakdowns?.byCity)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
