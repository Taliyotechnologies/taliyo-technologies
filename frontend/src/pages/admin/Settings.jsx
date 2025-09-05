import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Palette,
  Save,
  Eye,
  EyeOff,
  Camera,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import useAppearance from '../../hooks/useAppearance';
import usePushNotifications from '../../hooks/usePushNotifications';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize, compact, setCompact, reduceMotion, setReduceMotion, highContrast, setHighContrast, resetAppearance } = useAppearance();
  const { isSupported, permission, isSubscribed, loading: pushLoading, error: pushError, enablePush, disablePush, sendTest } = usePushNotifications();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [applyReport, setApplyReport] = useState({});

  const handleSave = () => {
    try {
      // Force re-apply current values and persist
      setTheme(theme);
      setFontSize(fontSize);
      setCompact(compact);
      setReduceMotion(reduceMotion);
      setHighContrast(highContrast);
    } catch {}

    // Verify applied to document
    try {
      const root = document.documentElement;
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const expectedDark = theme === 'dark' || (theme === 'auto' && prefersDark);
      const report = {
        theme: !!root.classList.contains('dark') === !!expectedDark,
        font: root.getAttribute('data-font') === fontSize,
        compact: root.getAttribute('data-compact') === String(!!compact),
        reduceMotion: root.getAttribute('data-reduce-motion') === String(!!reduceMotion),
        contrast: root.getAttribute('data-contrast') === (highContrast ? 'high' : 'normal'),
      };
      setApplyReport(report);
    } catch {
      setApplyReport({});
    }
    setShowSaveModal(true);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  return (
    <>
      <Helmet>
        <title>Settings - Taliyo Technologies</title>
        <meta name="description" content="Manage your account settings" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-600 mt-1 dark:text-gray-300">Manage your account and preferences</p>
              </div>
              <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700">
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-600/20 dark:text-blue-300 dark:border-blue-500/30'
                          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">General Settings</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Taliyo Technologies"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Website URL
                        </label>
                        <input
                          type="url"
                          defaultValue="https://taliyo.com"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Timezone
                        </label>
                        <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Language
                        </label>
                        <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile Settings</h3>
                    
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xl">A</span>
                        </div>
                        <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Admin User</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">admin@taliyo.com</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Admin"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue="User"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue="admin@taliyo.com"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          defaultValue="+91 98765 43210"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                        Bio
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="System administrator for Taliyo Technologies"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Security Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Enter current password"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Enter new password"
                          />
                          <button
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Re-enter new password"
                        />
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Add an extra layer of security to your account</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Receive updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Receive system notifications on this device (site-wide)</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={!!isSubscribed}
                            onChange={(e) => e.target.checked ? enablePush() : disablePush()}
                            disabled={!isSupported || pushLoading}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">{isSupported ? 'Supported' : 'Not supported'}</span>
                        <span className="text-xs px-2 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Permission: {permission}</span>
                        {pushLoading && <span className="text-xs text-blue-500">Working...</span>}
                        {pushError && <span className="text-xs text-red-500">{pushError}</span>}
                        <div className="flex-1" />
                        <button
                          onClick={async () => { await sendTest(); }}
                          disabled={!isSubscribed || pushLoading}
                          className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 disabled:opacity-50"
                        >
                          Send Test
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">SMS Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Receive text message alerts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="pt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Notification Preferences</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Project Updates</span>
                          <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                            <option>All notifications</option>
                            <option>Important only</option>
                            <option>None</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Team Activity</span>
                          <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                            <option>All notifications</option>
                            <option>Mentions only</option>
                            <option>None</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance Settings</h3>
                    <button
                      onClick={() => { resetAppearance(); setTheme('auto'); }}
                      className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset to defaults
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Theme Selection */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Color Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setTheme('light')}
                          className={`p-4 border rounded-lg text-center transition-colors ${
                            theme === 'light'
                              ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800 bg-blue-50 dark:bg-blue-900/30'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 bg-white dark:bg-gray-700'
                          }`}
                        >
                          <div className="h-16 mb-2 bg-white rounded shadow-sm flex items-center justify-center">
                            <div className="w-3/4 h-2 bg-gray-200 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Light</span>
                        </button>
                        
                        <button
                          onClick={() => setTheme('dark')}
                          className={`p-4 border rounded-lg text-center transition-colors ${
                            theme === 'dark'
                              ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800 bg-blue-50 dark:bg-blue-900/30'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 bg-white dark:bg-gray-700'
                          }`}
                        >
                          <div className="h-16 mb-2 bg-gray-800 rounded shadow-sm flex items-center justify-center">
                            <div className="w-3/4 h-2 bg-gray-700 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Dark</span>
                        </button>
                        
                        <button
                          onClick={() => setTheme('auto')}
                          className={`p-4 border rounded-lg text-center transition-colors ${
                            theme === 'auto'
                              ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800 bg-blue-50 dark:bg-blue-900/30'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 bg-white dark:bg-gray-700'
                          }`}
                        >
                          <div className="h-16 mb-2 bg-gradient-to-r from-white to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-white dark:bg-gray-800 w-1/2"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-3/4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">System</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Display Settings */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Font Size
                        </label>
                        <select 
                          value={fontSize}
                          onChange={(e) => setFontSize(e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                      
                      <div className="pt-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Compact Mode</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Reduce spacing for more content</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={compact} onChange={(e) => setCompact(e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Advanced Settings */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">Advanced Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Reduce Motion</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Disable animations and transitions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">High Contrast Mode</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Increase color contrast for better readability</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowSaveModal(false)} />
            <div className="relative z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-md shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance saved</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Your appearance settings have been applied across the website.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">{applyReport.font ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />} <span>Font size</span></li>
                <li className="flex items-center gap-2">{applyReport.compact ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />} <span>Compact mode</span></li>
                <li className="flex items-center gap-2">{applyReport.reduceMotion ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />} <span>Reduced motion</span></li>
                <li className="flex items-center gap-2">{applyReport.contrast ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />} <span>High contrast</span></li>
                <li className="flex items-center gap-2">{applyReport.theme ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />} <span>Theme</span></li>
              </ul>
              <div className="mt-5 flex justify-end">
                <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">OK</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Settings; 