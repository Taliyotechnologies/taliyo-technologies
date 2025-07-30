import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, AlertCircle, MailOpen, Settings2, Users2, UserPlus } from 'lucide-react';
import { FaUserCheck } from 'react-icons/fa';

const Sidebar = ({ features = [] }) => {
  const location = useLocation();
  return (
    <nav className="flex flex-col space-y-2">
      {features.includes('Analytics') && (
        <Link
          to="/admin/analytics"
          className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/analytics' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
          <BarChart2 size={20} className="mr-2" />
          <span>Analytics</span>
        </Link>
      )}
      {features.includes('Logs') && (
        <Link
          to="/admin/logs"
          className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/logs' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
          <AlertCircle size={20} className="mr-2" />
          <span>Logs & Error Tracking</span>
        </Link>
      )}
      {features.includes('Leads') && (
        <Link
          to="/admin/leads"
          className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/leads' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
          <MailOpen size={20} className="mr-2" />
          <span>Leads</span>
        </Link>
      )}
      {features.includes('SEO') && (
        <Link
          to="/admin/seo-meta"
          className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/seo-meta' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
          <Settings2 size={20} className="mr-2" />
          <span>SEO & Meta</span>
        </Link>
      )}
      {features.includes('Subscribers') && (
        <Link
          to="/admin/subscribers"
          className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/subscribers' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
          <FaUserCheck size={20} className="mr-2" />
          <span>Subscribers</span>
        </Link>
      )}
      {features.includes('Team') && (
        <Link
          to="/admin/team-management"
          className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/team-management' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
          <Users2 size={20} className="mr-2" />
          <span>Team Management</span>
        </Link>
      )}
      {features.includes('Users') && (
        <Link
          to="/admin/users"
          className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/users' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
          <UserPlus size={20} className="mr-2" />
          <span>Users</span>
        </Link>
      )}
      <Link
        to="/admin/settings"
        className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors mt-8 ${location.pathname === '/admin/settings' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
      >
        <Settings2 size={20} className="mr-2" />
        <span>Settings</span>
      </Link>
      {/* Add more links here as you add pages */}
    </nav>
  );
};

export default Sidebar; 