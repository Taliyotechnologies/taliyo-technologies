import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
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

const SEO = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const seoStats = [
    {
      title: 'Organic Traffic',
      value: '12,345',
      change: '+15%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Keyword Rankings',
      value: '234',
      change: '+8%',
      trend: 'up',
      icon: Search,
      color: 'bg-blue-500'
    },
    {
      title: 'Backlinks',
      value: '1,567',
      change: '+12%',
      trend: 'up',
      icon: Globe,
      color: 'bg-purple-500'
    },
    {
      title: 'Page Speed',
      value: '2.3s',
      change: '-0.5s',
      trend: 'down',
      icon: Target,
      color: 'bg-orange-500'
    }
  ];

  const keywords = [
    {
      id: 1,
      keyword: 'web development company',
      position: 3,
      change: '+2',
      traffic: '1,234',
      volume: '5,600',
      difficulty: 'Medium'
    },
    {
      id: 2,
      keyword: 'app development services',
      position: 5,
      change: '+1',
      traffic: '987',
      volume: '3,200',
      difficulty: 'High'
    },
    {
      id: 3,
      keyword: 'digital marketing agency',
      position: 8,
      change: '-1',
      traffic: '756',
      volume: '4,100',
      difficulty: 'Medium'
    },
    {
      id: 4,
      keyword: 'SEO services India',
      position: 2,
      change: '+3',
      traffic: '1,567',
      volume: '2,800',
      difficulty: 'Low'
    },
    {
      id: 5,
      keyword: 'ecommerce development',
      position: 12,
      change: '+4',
      traffic: '432',
      volume: '1,900',
      difficulty: 'High'
    }
  ];

  const pages = [
    {
      id: 1,
      url: '/services/web-development',
      title: 'Web Development Services',
      traffic: '2,345',
      bounceRate: '32%',
      avgTime: '2:45',
      seoScore: 92
    },
    {
      id: 2,
      url: '/services/app-development',
      title: 'App Development Services',
      traffic: '1,876',
      bounceRate: '28%',
      avgTime: '3:12',
      seoScore: 88
    },
    {
      id: 3,
      url: '/about',
      title: 'About Us',
      traffic: '1,234',
      bounceRate: '35%',
      avgTime: '1:58',
      seoScore: 85
    },
    {
      id: 4,
      url: '/contact',
      title: 'Contact Us',
      traffic: '987',
      bounceRate: '42%',
      avgTime: '1:23',
      seoScore: 78
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
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Add Keyword</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {seoStats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {getTrendIcon(stat.trend)}
                      <span className={`ml-1 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                    </div>
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
                        <span className="text-sm font-medium text-gray-900 dark:text-white">12,345</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">Direct Traffic</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">3,456</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">Referral Traffic</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">1,234</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Page Load Speed</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">2.3s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Mobile Score</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">95/100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Desktop Score</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">98/100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Core Web Vitals</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Good</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'keywords' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Keyword Rankings</h3>
                    <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                      View All Keywords
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Keyword
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Position
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Change
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Traffic
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Volume
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Difficulty
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {keywords.map((keyword) => (
                          <tr key={keyword.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{keyword.keyword}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-200">{keyword.position}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {keyword.change.startsWith('+') ? (
                                  <ArrowUp className="w-4 h-4 text-green-500" />
                                ) : keyword.change.startsWith('-') ? (
                                  <ArrowDown className="w-4 h-4 text-red-500" />
                                ) : (
                                  <Minus className="w-4 h-4 text-gray-500" />
                                )}
                                <span className={`ml-1 text-sm ${keyword.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : keyword.change.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {keyword.change}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-200">{keyword.traffic}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-200">{keyword.volume}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(keyword.difficulty)}`}>
                                {keyword.difficulty}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'pages' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Page Performance</h3>
                    <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                      View All Pages
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pages.map((page) => (
                      <div key={page.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{page.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{page.url}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Traffic</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{page.traffic}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Bounce Rate</span>
                            <span className="text-sm font-medium text-gray-900">{page.bounceRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Avg Time</span>
                            <span className="text-sm font-medium text-gray-900">{page.avgTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">SEO Score</span>
                            <span className={`text-sm font-medium ${getSEOScoreColor(page.seoScore)}`}>
                              {page.seoScore}/100
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                          placeholder="https://taliyo.com/sitemap.xml"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Robots.txt
                        </label>
                        <textarea
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin/"
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