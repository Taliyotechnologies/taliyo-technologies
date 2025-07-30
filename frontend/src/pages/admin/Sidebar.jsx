import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, AlertCircle, MailOpen, Settings2, Users2, UserPlus, Users, Building2, FileText } from 'lucide-react';
import { FaUserCheck } from 'react-icons/fa';

const Sidebar = ({ features = [] }) => {
  const location = useLocation();
  
  return (
    <nav className="flex flex-col space-y-2">
      {/* Dashboard/Analytics */}
      <Link
        to="/admin"
        className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin' || location.pathname === '/admin/analytics' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
      >
        <BarChart2 size={20} className="mr-2" />
        <span>Dashboard</span>
      </Link>
      
      {/* Leads */}
      <Link
        to="/admin/leads"
        className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/leads' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
      >
        <MailOpen size={20} className="mr-2" />
        <span>Leads</span>
      </Link>
      
      {/* User Management - Admin Only */}
      {features.includes('Users') && (
        <Link
          to="/admin/users"
          className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/users' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
          <Users size={20} className="mr-2" />
          <span>Users</span>
        </Link>
      )}
      
      {/* User Management - Admin Only */}
      {features.includes('Users') && (
        <Link
          to="/admin/user-management"
          className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/user-management' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
          <UserPlus size={20} className="mr-2" />
          <span>User Management</span>
        </Link>
      )}
      
      {/* Projects - Admin Only */}
      {features.includes('Projects') && (
        <Link
          to="/admin/projects"
          className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/projects' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
          <Building2 size={20} className="mr-2" />
          <span>Projects</span>
        </Link>
      )}
      
      {/* Team Management - Admin Only */}
      {features.includes('Team') && (
        <Link
          to="/admin/team"
          className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/team' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
          <Users2 size={20} className="mr-2" />
          <span>Team Management</span>
        </Link>
      )}
      
      {/* Logs - Admin Only */}
      {features.includes('Logs') && (
        <Link
          to="/admin/logs"
          className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors ${location.pathname === '/admin/logs' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
          <AlertCircle size={20} className="mr-2" />
          <span>Activity Logs</span>
        </Link>
      )}
      
      {/* Settings */}
      <Link
        to="/admin/settings"
        className={`flex items-center space-x-3 text-lg font-semibold rounded px-3 py-2 transition-colors mt-8 ${location.pathname === '/admin/settings' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
      >
        <Settings2 size={20} className="mr-2" />
        <span>Settings</span>
      </Link>
    </nav>
  );
};

export default Sidebar; 