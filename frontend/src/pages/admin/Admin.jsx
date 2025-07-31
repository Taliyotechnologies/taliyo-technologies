import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaEye, FaBars, FaTimes, FaCog, FaDownload, FaBell } from 'react-icons/fa';
import UserManagement from './UserManagement';
import Projects from './Projects';
import TeamManagement from './TeamManagement';

const API = import.meta.env.VITE_API_URL || 'https://taliyo-backend.onrender.com';
const socket = io(API);

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('admin_user'));
  } catch {
    return null;
  }
};

const Sidebar = ({ section, setSection, onLogout, isMobile, toggleSidebar, theme, setTheme }) => {
  const user = getUser();
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col py-8 px-4 transform transition-transform duration-300 ease-in-out ${
        isMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-blue-400">Admin</h2>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <nav className="flex flex-col gap-2 mb-8 flex-1">
          {['Dashboard', 'Blogs', 'Subscribers', 'Contacts', 'Settings'].map(s => (
            <button
              key={s}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                section === s ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => {
                setSection(s);
                if (isMobile) toggleSidebar();
              }}
            >
              {s}
            </button>
          ))}
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                setSection('User Management');
                if (isMobile) toggleSidebar();
              }}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                section === 'User Management' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              User Management
            </button>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                setSection('Activity Logs');
                if (isMobile) toggleSidebar();
              }}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                section === 'Activity Logs' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Activity Logs
            </button>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                setSection('Projects');
                if (isMobile) toggleSidebar();
              }}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                section === 'Projects' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Projects
            </button>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={() => {
                setSection('Team Management');
                if (isMobile) toggleSidebar();
              }}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                section === 'Team Management' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Team Management
            </button>
          )}
        </nav>
        
        {/* Theme Toggle */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-300">Theme</span>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <div className={`w-4 h-4 rounded border ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}></div>
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="text-sm text-gray-400 mb-4 px-4">
            Logged in as: {user?.email}
          </div>
          <button
            onClick={onLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

const DashboardCards = ({ liveVisitors, pageStats, subscribers, contacts }) => {
  const totalViews = Object.values(pageStats).reduce((a, b) => a + (b.views || 0), 0);
  const totalUnique = Object.values(pageStats).reduce((a, b) => a + (b.unique || 0), 0);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-4 lg:p-6 flex flex-col items-center">
        <div className="text-2xl lg:text-4xl font-bold text-white mb-2">{liveVisitors}</div>
        <div className="text-blue-100 text-center text-sm lg:text-base">Live Visitors</div>
        <div className="text-xs text-blue-200 mt-1">Real-time</div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-lg p-4 lg:p-6 flex flex-col items-center">
        <div className="text-2xl lg:text-4xl font-bold text-white mb-2">{totalViews}</div>
        <div className="text-purple-100 text-center text-sm lg:text-base">Total Views</div>
        <div className="text-xs text-purple-200 mt-1">All pages</div>
      </div>
      
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg p-4 lg:p-6 flex flex-col items-center">
        <div className="text-2xl lg:text-4xl font-bold text-white mb-2">{subscribers?.length || 0}</div>
        <div className="text-green-100 text-center text-sm lg:text-base">Subscribers</div>
        <div className="text-xs text-green-200 mt-1">Newsletter</div>
      </div>
      
      <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl shadow-lg p-4 lg:p-6 flex flex-col items-center">
        <div className="text-2xl lg:text-4xl font-bold text-white mb-2">{contacts?.length || 0}</div>
        <div className="text-orange-100 text-center text-sm lg:text-base">Contacts</div>
        <div className="text-xs text-orange-200 mt-1">Form submissions</div>
      </div>
    </div>
  );
};

const BlogAnalytics = ({ pageStats }) => {
  const sortedPages = Object.entries(pageStats)
    .sort(([,a], [,b]) => (b.views || 0) - (a.views || 0))
    .slice(0, 10); // Show top 10 pages

  return (
    <div className="bg-gray-900 rounded-2xl shadow p-4 lg:p-6 mb-8">
      <h2 className="text-xl lg:text-2xl font-semibold mb-4">Top Pages Analytics (Real-Time)</h2>
      {sortedPages.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl lg:text-6xl mb-4">📊</div>
          <p className="text-sm lg:text-base">No page views recorded yet.</p>
          <p className="text-xs lg:text-sm mt-2">Visit your website to start seeing analytics data.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm lg:text-base">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 px-2 lg:px-4">Rank</th>
                <th className="py-2 px-2 lg:px-4">Page/Blog</th>
                <th className="py-2 px-2 lg:px-4">Views</th>
                <th className="py-2 px-2 lg:px-4">Unique</th>
                <th className="py-2 px-2 lg:px-4">Avg. Duration</th>
              </tr>
            </thead>
            <tbody>
              {sortedPages.map(([page, stats], index) => (
                <tr key={page} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-2 px-2 lg:px-4">
                    <span className={`inline-flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-2 px-2 lg:px-4 font-mono text-xs lg:text-sm truncate max-w-[120px] lg:max-w-none" title={page}>
                    {page}
                  </td>
                  <td className="py-2 px-2 lg:px-4 font-bold">{stats.views || 0}</td>
                  <td className="py-2 px-2 lg:px-4">{stats.unique || 0}</td>
                  <td className="py-2 px-2 lg:px-4">{stats.avgDuration || 0}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Subscribers = ({ subscribers }) => (
  <div className="bg-gray-900 rounded-2xl shadow p-4 lg:p-6 mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl lg:text-2xl font-semibold">Newsletter Subscribers</h2>
      <div className="text-xs lg:text-sm text-gray-400">
        Total: {subscribers?.length || 0} subscribers
      </div>
    </div>
    
    {!subscribers || subscribers.length === 0 ? (
      <div className="text-center py-8 text-gray-400">
        <div className="text-4xl lg:text-6xl mb-4">📧</div>
        <p className="text-sm lg:text-base">No subscribers yet.</p>
        <p className="text-xs lg:text-sm mt-2">Subscribers will appear here when they sign up for your newsletter.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm lg:text-base">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-2 lg:px-4">#</th>
              <th className="py-2 px-2 lg:px-4">Email</th>
              <th className="py-2 px-2 lg:px-4">Subscribed At</th>
              <th className="py-2 px-2 lg:px-4">Days Ago</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub, index) => {
              const subscribedDate = new Date(sub.createdAt);
              const daysAgo = Math.floor((Date.now() - subscribedDate.getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <tr key={sub._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-2 px-2 lg:px-4 text-gray-400">{index + 1}</td>
                  <td className="py-2 px-2 lg:px-4 font-mono text-xs lg:text-sm truncate max-w-[200px] lg:max-w-none" title={sub.email}>
                    {sub.email}
                  </td>
                  <td className="py-2 px-2 lg:px-4 text-xs lg:text-sm">{subscribedDate.toLocaleDateString()}</td>
                  <td className="py-2 px-2 lg:px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      daysAgo === 0 ? 'bg-green-600 text-white' :
                      daysAgo <= 7 ? 'bg-blue-600 text-white' :
                      'bg-gray-600 text-gray-300'
                    }`}>
                      {daysAgo === 0 ? 'Today' : 
                       daysAgo === 1 ? 'Yesterday' : 
                       `${daysAgo} days ago`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const Contacts = ({ contacts }) => (
  <div className="bg-gray-900 rounded-2xl shadow p-4 lg:p-6 mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl lg:text-2xl font-semibold">Contact Submissions</h2>
      <div className="text-xs lg:text-sm text-gray-400">
        Total: {contacts?.length || 0} submissions
      </div>
    </div>
    
    {!contacts || contacts.length === 0 ? (
      <div className="text-center py-8 text-gray-400">
        <div className="text-4xl lg:text-6xl mb-4">📞</div>
        <p className="text-sm lg:text-base">No contact submissions yet.</p>
        <p className="text-xs lg:text-sm mt-2">Contact form submissions will appear here when visitors submit the form.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm lg:text-base">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-2 lg:px-4">#</th>
              <th className="py-2 px-2 lg:px-4">Name</th>
              <th className="py-2 px-2 lg:px-4">Email</th>
              <th className="py-2 px-2 lg:px-4">Service</th>
              <th className="py-2 px-2 lg:px-4 hidden lg:table-cell">Message</th>
              <th className="py-2 px-2 lg:px-4">Submitted</th>
              <th className="py-2 px-2 lg:px-4">Details</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, index) => {
              const submittedDate = new Date(c.createdAt);
              const daysAgo = Math.floor((Date.now() - submittedDate.getTime()) / (1000 * 60 * 60 * 24));
              const messagePreview = c.message?.length > 50 ? c.message.substring(0, 50) + '...' : c.message;
              
              return (
                <tr key={c._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-2 px-2 lg:px-4 text-gray-400">{index + 1}</td>
                  <td className="py-2 px-2 lg:px-4 font-medium text-xs lg:text-sm truncate max-w-[100px] lg:max-w-none" title={c.name}>
                    {c.name}
                  </td>
                  <td className="py-2 px-2 lg:px-4 font-mono text-xs lg:text-sm truncate max-w-[150px] lg:max-w-none" title={c.email}>
                    {c.email}
                  </td>
                  <td className="py-2 px-2 lg:px-4">
                    {c.service && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                        {c.service}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 lg:px-4 text-sm text-gray-300 hidden lg:table-cell" title={c.message}>
                    {messagePreview}
                  </td>
                  <td className="py-2 px-2 lg:px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      daysAgo === 0 ? 'bg-green-600 text-white' :
                      daysAgo <= 7 ? 'bg-blue-600 text-white' :
                      'bg-gray-600 text-gray-300'
                    }`}>
                      {daysAgo === 0 ? 'Today' : 
                       daysAgo === 1 ? 'Yesterday' : 
                       `${daysAgo} days ago`}
                    </span>
                  </td>
                  <td className="py-2 px-2 lg:px-4">
                    <button 
                      onClick={() => alert(`Full Details:\n\nName: ${c.name}\nEmail: ${c.email}\nPhone: ${c.phone || 'N/A'}\nCompany: ${c.company || 'N/A'}\nService: ${c.service || 'N/A'}\nBudget: ${c.budget || 'N/A'}\nTimeline: ${c.timeline || 'N/A'}\n\nMessage:\n${c.message}`)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                      title="View full details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const GrandTotals = ({ totals }) => {
  // Calculate overall totals
  const totalViews = totals.reduce((sum, p) => sum + (p.views || 0), 0);
  // For unique visitors across all pages, deduplicate userIds
  const allUniqueUserIds = new Set();
  totals.forEach(p => {
    if (Array.isArray(p._uniqueUserIds)) {
      p._uniqueUserIds.forEach(id => allUniqueUserIds.add(id));
    }
  });
  // Fallback: if _uniqueUserIds not present, fallback to unique count sum
  const totalUnique = allUniqueUserIds.size || totals.reduce((sum, p) => sum + (p.unique || 0), 0);

  const handleView = (page) => {
    alert(`Page: ${page.page}\nTotal Views: ${page.views}\nUnique Visitors: ${page.unique}`);
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow p-4 lg:p-6 mb-8">
      <h2 className="text-xl lg:text-2xl font-semibold mb-4">Grand Totals (All Time)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-4">
        <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center">
          <div className="text-2xl lg:text-3xl font-bold text-blue-400 mb-1">{totalViews}</div>
          <div className="text-sm lg:text-lg text-center">Total Views (All Pages)</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center">
          <div className="text-2xl lg:text-3xl font-bold text-green-400 mb-1">{totalUnique}</div>
          <div className="text-sm lg:text-lg text-center">Total Unique Visitors</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm lg:text-base">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-2 lg:px-4">Page/Blog</th>
              <th className="py-2 px-2 lg:px-4">Total Views</th>
              <th className="py-2 px-2 lg:px-4">Unique Visitors</th>
              <th className="py-2 px-2 lg:px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {totals.map(page => (
              <tr key={page.page} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-2 px-2 lg:px-4 font-mono text-xs lg:text-sm truncate max-w-[150px] lg:max-w-none" title={page.page}>
                  {page.page}
                </td>
                <td className="py-2 px-2 lg:px-4">{page.views}</td>
                <td className="py-2 px-2 lg:px-4">{page.unique}</td>
                <td className="py-2 px-2 lg:px-4">
                  <button onClick={() => handleView(page)} className="text-blue-400 hover:text-blue-600" title="View details">
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const timeRanges = [
  { label: '1 Day', days: 1 },
  { label: '7 Days', days: 7 },
  { label: '4 Weeks', days: 28 },
  { label: '1 Year', days: 365 },
];

const BlogAnalyticsChart = () => {
  const [range, setRange] = useState(timeRanges[1]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - range.days + 1);
    setLoading(true);
    fetch(`${API}/api/admin/analytics/range?start=${start.toISOString()}&end=${end.toISOString()}`)
      .then(r => r.json())
      .then(data => {
        // Group by day
        const byDay = {};
        data.forEach(row => {
          const day = new Date(row.date).toLocaleDateString();
          if (!byDay[day]) byDay[day] = { date: day, views: 0, unique: 0 };
          byDay[day].views += row.views;
          byDay[day].unique += row.unique;
        });
        setChartData(Object.values(byDay));
      })
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="bg-gray-900 rounded-2xl shadow p-4 lg:p-6 mb-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-4">
        <h2 className="text-xl lg:text-2xl font-semibold">Blog/Page Views Chart</h2>
        <div className="flex gap-2 ml-auto flex-wrap">
          {timeRanges.map(r => (
            <button
              key={r.label}
              className={`px-2 lg:px-3 py-1 lg:py-1 rounded text-xs lg:text-sm ${
                range.label === r.label ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setRange(r)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#60a5fa" name="Views" strokeWidth={2} />
            <Line type="monotone" dataKey="unique" stroke="#f472b6" name="Unique Visitors" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {loading && <div className="text-center text-gray-400 mt-2">Loading...</div>}
    </div>
  );
};

const Settings = ({ theme, setTheme }) => {
  const user = getUser();
  const [notificationEnabled, setNotificationEnabled] = useState(true); // Default true, fetch from backend in real use
  const [exporting, setExporting] = useState(false);
  const [systemStatus, setSystemStatus] = useState({ connected: true, lastCheck: new Date() });
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newsletterData, setNewsletterData] = useState({ subject: '', content: '' });
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [logs, setLogs] = useState([]);
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const exportContacts = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const contacts = await response.json();
      
      const csv = [
        ['Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Timeline', 'Message', 'Submitted'],
        ...contacts.map(c => [
          c.name,
          c.email,
          c.phone || '',
          c.company || '',
          c.service || '',
          c.budget || '',
          c.timeline || '',
          c.message,
          new Date(c.createdAt).toLocaleDateString()
        ])
      ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportSubscribers = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/subscribers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const subscribers = await response.json();
      
      const csv = [
        ['Email', 'Subscribed Date'],
        ...subscribers.map(s => [
          s.email,
          new Date(s.createdAt).toLocaleDateString()
        ])
      ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const sendNewsletter = async () => {
    if (!newsletterData.subject || !newsletterData.content) {
      alert('Please fill in both subject and content');
      return;
    }
    
    setSendingNewsletter(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/send-newsletter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newsletterData)
      });
      
      if (response.ok) {
        alert('Newsletter sent successfully!');
        setShowNewsletterModal(false);
        setNewsletterData({ subject: '', content: '' });
      } else {
        const error = await response.json();
        alert(`Failed to send newsletter: ${error.message}`);
      }
    } catch (error) {
      alert('Failed to send newsletter. Please try again.');
    } finally {
      setSendingNewsletter(false);
    }
  };

  const handleChangePassword = async () => {
    if (!changePasswordData.currentPassword || !changePasswordData.newPassword || !changePasswordData.confirmPassword) {
      setPasswordMessage('All fields are required');
      return;
    }

    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      return;
    }

    if (changePasswordData.newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    setPasswordMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: changePasswordData.currentPassword,
          newPassword: changePasswordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage('Password changed successfully! You will be logged out.');
        setChangePasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswords({ current: false, new: false, confirm: false });
        
        // Log out after successful password change
        setTimeout(() => {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin_user');
          window.location.href = '/admin/login';
        }, 2000);
      } else {
        setPasswordMessage(data.message || 'Failed to change password');
      }
    } catch (error) {
      setPasswordMessage('Network error. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const loadLogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API}/api/admin/logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const logsData = await response.json();
        setLogs(logsData);
      }
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-gray-900 dark:bg-gray-900 rounded-2xl shadow p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm lg:text-base">Database Connection</span>
              <span className={`px-2 py-1 rounded text-xs ${systemStatus.connected ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {systemStatus.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Last checked: {systemStatus.lastCheck.toLocaleTimeString()}
            </p>
          </div>
          <div className="bg-gray-800 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm lg:text-base">Server Status</span>
              <span className="px-2 py-1 rounded text-xs bg-green-600 text-white">
                Online
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Running on port 5000
            </p>
          </div>
        </div>
      </div>

      {/* Export Data */}
      <div className="bg-gray-900 dark:bg-gray-900 rounded-2xl shadow p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-semibold mb-4">Export Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={exportContacts}
            disabled={exporting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaDownload size={16} />
            {exporting ? 'Exporting...' : 'Export Contacts'}
          </button>
          <button
            onClick={exportSubscribers}
            disabled={exporting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaDownload size={16} />
            {exporting ? 'Exporting...' : 'Export Subscribers'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Downloads will be in CSV format with all data
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 dark:bg-gray-900 rounded-2xl shadow p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowNewsletterModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaBell size={16} />
            Send Newsletter
          </button>
          <button 
            onClick={() => setShowSettingsModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaCog size={16} />
            System Settings
          </button>
          <button 
            onClick={() => setShowChangePasswordModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaEye size={16} />
            Change Password
          </button>
          <button 
            onClick={() => {
              setShowLogsModal(true);
              loadLogs();
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaEye size={16} />
            View Logs
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="bg-gray-900 dark:bg-gray-900 rounded-2xl shadow p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-semibold mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Admin Panel Version:</strong> 1.0.0</p>
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Database:</strong> MongoDB</p>
          </div>
          <div>
            <p><strong>Backend:</strong> Node.js/Express</p>
            <p><strong>Frontend:</strong> React/Vite</p>
            <p><strong>Real-time:</strong> Socket.io</p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Change Password</h3>
                <button 
                  onClick={() => setShowChangePasswordModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={changePasswordData.currentPassword}
                      onChange={(e) => setChangePasswordData({...changePasswordData, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 dark:bg-gray-800 border border-gray-700 rounded-lg text-white pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <FaEye size={16} />
                    </button>
                  </div>
                </div>
                
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={changePasswordData.newPassword}
                      onChange={(e) => setChangePasswordData({...changePasswordData, newPassword: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 dark:bg-gray-800 border border-gray-700 rounded-lg text-white pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <FaEye size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={changePasswordData.confirmPassword}
                      onChange={(e) => setChangePasswordData({...changePasswordData, confirmPassword: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-800 dark:bg-gray-800 border border-gray-700 rounded-lg text-white pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <FaEye size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Message */}
                {passwordMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    passwordMessage.includes('successfully') 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    {passwordMessage}
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {changingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    onClick={() => setShowChangePasswordModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">System Settings</h3>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Admin Panel Theme</label>
                  <div className="space-y-2">
                    <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      <input 
                        type="radio" 
                        name="theme" 
                        value="dark"
                        checked={theme === 'dark'}
                        onChange={(e) => handleThemeChange(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-800 rounded mr-2"></div>
                        <span>Dark Theme</span>
                      </div>
                    </label>
                    
                    <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      <input 
                        type="radio" 
                        name="theme" 
                        value="light"
                        checked={theme === 'light'}
                        onChange={(e) => handleThemeChange(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-white border border-gray-300 rounded mr-2"></div>
                        <span>Light Theme</span>
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Theme preference is saved automatically
                  </p>
                </div>
                
                {/* Notification toggle only for admin */}
                {user?.role === 'admin' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">System Notifications</label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={notificationEnabled}
                        onChange={e => setNotificationEnabled(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-200">Enable email notifications for important system events</span>
                    </label>
                    <p className="text-xs text-gray-400 mt-1">You will receive notifications when users visit or important actions occur.</p>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowSettingsModal(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Save Settings
                  </button>
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Modal */}
      {showNewsletterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 dark:bg-gray-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Send Newsletter</h3>
                <button 
                  onClick={() => setShowNewsletterModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={newsletterData.subject}
                    onChange={(e) => setNewsletterData({...newsletterData, subject: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 dark:bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="Enter newsletter subject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={newsletterData.content}
                    onChange={(e) => setNewsletterData({...newsletterData, content: e.target.value})}
                    rows={10}
                    className="w-full px-3 py-2 bg-gray-800 dark:bg-gray-800 border border-gray-700 rounded-lg text-white resize-none"
                    placeholder="Enter newsletter content (HTML supported)"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={sendNewsletter}
                    disabled={sendingNewsletter}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {sendingNewsletter ? 'Sending...' : 'Send Newsletter'}
                  </button>
                  <button
                    onClick={() => setShowNewsletterModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 dark:bg-gray-900 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">System Logs</h3>
                <button 
                  onClick={() => setShowLogsModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                {logs.length > 0 ? (
                  <div className="space-y-2 text-sm">
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 bg-gray-700 dark:bg-gray-700 rounded">
                        <span className="text-gray-400 text-xs min-w-[100px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.level === 'error' ? 'bg-red-600 text-white' :
                          log.level === 'warning' ? 'bg-yellow-600 text-white' :
                          'bg-green-600 text-white'
                        }`}>
                          {log.level}
                        </span>
                        <span className="text-gray-300">{log.message}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <p>No logs available</p>
                    <p className="text-sm mt-2">System logs will appear here</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={loadLogs}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Refresh Logs
                </button>
                <button
                  onClick={() => setShowLogsModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const user = getUser();

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API}/api/admin/logs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setLogs(data);
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const loginLogs = logs.filter(log => log.action === 'login');
  const filteredLogs = filter === 'all' ? logs : loginLogs;
  const uniqueLoginUsers = Array.from(new Set(loginLogs.map(l => l.user)));

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="bg-gray-900 rounded-2xl shadow p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-semibold">Activity Logs</h2>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
            onClick={() => setFilter('all')}
          >
            All Actions
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
            onClick={() => setFilter('login')}
          >
            Login History
          </button>
        </div>
      </div>
      {filter === 'login' && !loading && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="bg-blue-800 text-blue-100 rounded-lg px-6 py-4 flex-1 text-center">
            <div className="text-2xl font-bold">{uniqueLoginUsers.length}</div>
            <div className="text-sm mt-1">Unique Users</div>
          </div>
          <div className="bg-blue-800 text-blue-100 rounded-lg px-6 py-4 flex-1 text-center">
            <div className="text-2xl font-bold">{loginLogs.length}</div>
            <div className="text-sm mt-1">Total Login Events</div>
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="py-2 px-4">User</th>
                {filter === 'all' && <th className="py-2 px-4">Action</th>}
                {filter === 'all' && <th className="py-2 px-4">Details</th>}
                <th className="py-2 px-4">IP</th>
                <th className="py-2 px-4">Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr><td colSpan={filter === 'all' ? 5 : 4} className="text-center py-6 text-gray-400">No logs found.</td></tr>
              ) : filteredLogs.map((log, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-2 px-4">{log.user}</td>
                  {filter === 'all' && <td className="py-2 px-4 capitalize">{log.action}</td>}
                  {filter === 'all' && <td className="py-2 px-4">{log.details}</td>}
                  <td className="py-2 px-4">{log.ip || '-'}</td>
                  <td className="py-2 px-4">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  // Read last section from localStorage, default to 'Dashboard'
  const getInitialSection = () => {
    return localStorage.getItem('admin_section') || 'Dashboard';
  };
  const [section, setSectionState] = useState(getInitialSection());
  const [liveVisitors, setLiveVisitors] = useState(0);
  const [pageStats, setPageStats] = useState({});
  const [subscribers, setSubscribers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [grandTotals, setGrandTotals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setThemeState] = useState(localStorage.getItem('admin_theme') || 'dark');

  // Update setSection to also save to localStorage
  const setSection = (newSection) => {
    setSectionState(newSection);
    localStorage.setItem('admin_section', newSection);
  };

  // Theme management
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('admin_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.body.classList.add('admin-panel');
    // Apply initial theme
    document.documentElement.setAttribute('data-theme', theme);
    return () => {
      document.body.classList.remove('admin-panel');
    };
  }, [theme]);

  useEffect(() => {
    // Socket connections for real-time data
    socket.on('liveVisitors', setLiveVisitors);
    socket.on('pageStats', setPageStats);

    // Fetch initial data
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        const token = localStorage.getItem('adminToken');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch all data in parallel
        const [subscribersRes, contactsRes, analyticsRes] = await Promise.all([
          fetch(`${API}/api/admin/subscribers`, { headers }),
          fetch(`${API}/api/admin/contacts`, { headers }),
          fetch(`${API}/api/admin/blog-analytics`, { headers })
        ]);

        if (subscribersRes.ok) {
          const subscribersData = await subscribersRes.json();
          setSubscribers(subscribersData);
        }

        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          setContacts(contactsData);
        }

        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setPageStats(analyticsData);
        }

        // Try to fetch grand totals (if endpoint exists)
        try {
          const totalsRes = await fetch(`${API}/api/admin/analytics/total`, { headers });
          if (totalsRes.ok) {
            const totalsData = await totalsRes.json();
            setGrandTotals(totalsData.map(row => ({ ...row, _uniqueUserIds: row.uniqueUserIds || [] })));
          }
        } catch (err) {
          console.log('Grand totals endpoint not available');
        }

      } catch (err) {
        setError('Failed to load dashboard data. Please refresh the page.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      socket.off('liveVisitors');
      socket.off('pageStats');
    };
  }, []);

  useEffect(() => {
    const updateMobileView = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      setIsSidebarOpen(window.innerWidth >= 1024); // lg breakpoint
    };

    updateMobileView(); // Set initial value
    window.addEventListener('resize', updateMobileView);
    return () => window.removeEventListener('resize', updateMobileView);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar 
        section={section} 
        setSection={setSection} 
        onLogout={handleLogout} 
        isMobile={isMobile && isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {/* Mobile menu button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white p-2"
          >
            <FaBars size={24} />
          </button>
        </div>
        
        <h1 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">Admin Dashboard</h1>
        
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {section === 'Dashboard' && <DashboardCards liveVisitors={liveVisitors} pageStats={pageStats} subscribers={subscribers} contacts={contacts} />}
            {section === 'Dashboard' && <GrandTotals totals={grandTotals} />}
            {section === 'Dashboard' && <BlogAnalytics pageStats={pageStats} />}
            {section === 'Blogs' && <BlogAnalyticsChart />}
            {section === 'Subscribers' && <Subscribers subscribers={subscribers} />}
            {section === 'Contacts' && <Contacts contacts={contacts} />}
            {section === 'Settings' && <Settings theme={theme} setTheme={setTheme} />}
            {section === 'User Management' && <UserManagement />}
            {section === 'Activity Logs' && <ActivityLogs />}
            {section === 'Projects' && <Projects />}
            {section === 'Team Management' && <TeamManagement />}
          </>
        )}
      </main>
    </div>
  );
};

export default Admin; 