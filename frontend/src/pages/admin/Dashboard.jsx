import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  FileText, 
  Settings, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Calendar,
  DollarSign,
  Activity,
  Target,
  BarChart3,
  Globe
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Projects',
      value: '89',
      change: '+8%',
      icon: FileText,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Active SEO',
      value: '45',
      change: '+15%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      change: '+23%',
      icon: DollarSign,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New project created',
      description: 'E-commerce website for ABC Company',
      time: '2 hours ago',
      type: 'project'
    },
    {
      id: 2,
      action: 'SEO report generated',
      description: 'Monthly SEO performance report',
      time: '4 hours ago',
      type: 'seo'
    },
    {
      id: 3,
      action: 'New team member added',
      description: 'John Doe joined as Frontend Developer',
      time: '1 day ago',
      type: 'team'
    },
    {
      id: 4,
      action: 'Blog post published',
      description: 'Web Development Trends 2024',
      time: '2 days ago',
      type: 'blog'
    }
  ];

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
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Last updated</p>
                  <p className="text-sm font-medium text-gray-900">Just now</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm font-medium ${stat.textColor} mt-1`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <a
                      key={index}
                      href={action.href}
                      className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className={`${action.color} p-2 rounded-lg mr-4`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{action.title}</p>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traffic Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Website Traffic</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">12,345</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Organic Search</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">8,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Social Media</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">2,456</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Page Load Speed</span>
                  <span className="text-sm font-medium text-green-600">2.3s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SEO Score</span>
                  <span className="text-sm font-medium text-green-600">92/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="text-sm font-medium text-green-600">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 