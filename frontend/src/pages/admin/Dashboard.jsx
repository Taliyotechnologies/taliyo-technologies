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