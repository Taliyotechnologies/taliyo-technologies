import React, { useState, useEffect } from 'react';
import { Settings2, Upload, Mail, Lock, Bell, Palette, Users2, ToggleRight, ChevronDown, Save, RefreshCw, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(API_BASE_URL);

const features = ['Analytics', 'Leads', 'SEO', 'Team', 'Logs', 'Subscribers', 'Services'];
const integrations = ['Google Analytics', 'SMTP', 'Facebook', 'Twitter'];

export default function Settings() {
  // State for settings
  const [settings, setSettings] = useState({
    companyName: 'Taliyo Technologies',
    companyTagline: 'Top IT Company in India',
    companyDescription: 'Leading technology solutions provider',
    email: 'info@taliyo.com',
    phone: '+91 9876543210',
    address: 'Delhi, India',
    websiteUrl: 'https://taliyo.com',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    theme: 'dark',
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    features: features.reduce((a, f) => ({ ...a, [f]: true }), {}),
    integrations: integrations.reduce((a, i) => ({ ...a, [i]: false }), {})
  });

  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [showService, setShowService] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  // Password reset state
  const [passwordReset, setPasswordReset] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
    
    // Listen for real-time settings updates
    socket.on('settings:updated', (updatedSettings) => {
      setSettings(prev => ({ ...prev, ...updatedSettings }));
      toast.success('Settings updated in real-time!');
    });
    
    socket.on('settings:created', (newSettings) => {
      setSettings(prev => ({ ...prev, ...newSettings }));
      toast.success('New settings created!');
    });
    
    socket.on('settings:reset', (defaultSettings) => {
      setSettings(prev => ({ ...prev, ...defaultSettings }));
      toast.success('Settings reset to defaults!');
    });
    
    return () => {
      socket.off('settings:updated');
      socket.off('settings:created');
      socket.off('settings:reset');
    };
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      } else {
        console.error('Failed to load settings');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (updatedSettings = null) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      const settingsToSave = updatedSettings || settings;
      
      // Save each setting individually
      for (const [key, value] of Object.entries(settingsToSave)) {
        const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ key, value })
        });
        
        if (!response.ok) {
          const error = await response.json();
          toast.error(error.message || 'Failed to save settings');
          return;
        }
      }
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Auto-save after a delay
    setTimeout(() => {
      saveSettings({ ...settings, [key]: value });
    }, 1000);
  };

  const handleFeatureToggle = (feature) => {
    const updatedFeatures = { ...settings.features, [feature]: !settings.features[feature] };
    const updatedSettings = { ...settings, features: updatedFeatures };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  const handleIntegrationToggle = (integration) => {
    const updatedIntegrations = { ...settings.integrations, [integration]: !settings.integrations[integration] };
    const updatedSettings = { ...settings, integrations: updatedIntegrations };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  const testEmailSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/api/settings/test-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          smtpHost: settings.smtpHost,
          smtpPort: settings.smtpPort,
          smtpUser: settings.smtpUser,
          smtpPassword: settings.smtpPassword,
          testEmail: settings.email
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Email test successful!');
      } else {
        toast.error(result.message || 'Email test failed');
      }
    } catch (error) {
      console.error('Error testing email:', error);
      toast.error('Failed to test email settings');
    }
  };

  const testAnalyticsSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/api/settings/test-analytics`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          googleAnalyticsId: settings.googleAnalyticsId,
          facebookPixelId: settings.facebookPixelId
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Analytics test successful!');
      } else {
        toast.error(result.message || 'Analytics test failed');
      }
    } catch (error) {
      console.error('Error testing analytics:', error);
      toast.error('Failed to test analytics settings');
    }
  };

  const resetPassword = async () => {
    if (passwordReset.newPassword !== passwordReset.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordReset.newPassword.length < settings.passwordMinLength) {
      toast.error(`Password must be at least ${settings.passwordMinLength} characters`);
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/api/admin/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordReset.currentPassword,
          newPassword: passwordReset.newPassword
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Password changed successfully!');
        setPasswordReset({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(result.message || 'Password change failed');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    }
  };

  const resetToDefaults = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/api/settings/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const defaultSettings = await response.json();
        setSettings(prev => ({ ...prev, ...defaultSettings }));
        toast.success('Settings reset to defaults successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to reset settings');
      }
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Failed to reset settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-xl text-gray-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings2 className="text-blue-500" /> Settings
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => saveSettings()}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition disabled:opacity-60"
          >
            {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save All'}
          </button>
          <button
            onClick={resetToDefaults}
            disabled={saving}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition disabled:opacity-60"
          >
            <RefreshCw size={16} />
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Site Info & Branding */}
      <section className="bg-gray-900 rounded-xl p-6 shadow space-y-4">
        <h2 className="text-lg font-semibold text-white mb-4">Site Info & Branding</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-gray-300 font-medium">Company Name</label>
            <input 
              className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={settings.companyName} 
              onChange={e => handleSettingChange('companyName', e.target.value)} 
            />
            
            <label className="block text-gray-300 font-medium">Tagline</label>
            <input 
              className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={settings.companyTagline} 
              onChange={e => handleSettingChange('companyTagline', e.target.value)} 
            />
            
            <label className="block text-gray-300 font-medium">Description</label>
            <textarea 
              className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              rows="3"
              value={settings.companyDescription} 
              onChange={e => handleSettingChange('companyDescription', e.target.value)} 
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-gray-300 font-medium">Website URL</label>
            <input 
              className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={settings.websiteUrl} 
              onChange={e => handleSettingChange('websiteUrl', e.target.value)} 
            />
            
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Logo</label>
              <button className="flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700 transition">
                <Upload size={16} /> Upload Logo
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Favicon</label>
              <button className="flex items-center gap-2 bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700 transition">
                <Upload size={16} /> Upload Favicon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info & Email Config */}
      <section className="bg-gray-900 rounded-xl p-6 shadow space-y-4">
        <h2 className="text-lg font-semibold text-white mb-4">Contact & Email</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-gray-300 font-medium">Contact Email</label>
            <input 
              className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={settings.email} 
              onChange={e => handleSettingChange('email', e.target.value)} 
            />
            
            <label className="block text-gray-300 font-medium">Phone</label>
            <input 
              className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={settings.phone} 
              onChange={e => handleSettingChange('phone', e.target.value)} 
            />
            
            <label className="block text-gray-300 font-medium">Address</label>
            <textarea 
              className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              rows="2"
              value={settings.address} 
              onChange={e => handleSettingChange('address', e.target.value)} 
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-gray-300 font-medium">SMTP Host</label>
            <input 
              className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={settings.smtpHost} 
              onChange={e => handleSettingChange('smtpHost', e.target.value)} 
            />
            
            <label className="block text-gray-300 font-medium">SMTP Port</label>
            <input 
              type="number"
              className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={settings.smtpPort} 
              onChange={e => handleSettingChange('smtpPort', parseInt(e.target.value))} 
            />
            
            <label className="block text-gray-300 font-medium">SMTP Username</label>
            <input 
              className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={settings.smtpUser} 
              onChange={e => handleSettingChange('smtpUser', e.target.value)} 
            />
            
            <label className="block text-gray-300 font-medium">SMTP Password</label>
            <div className="relative">
              <input 
                type={showSmtpPassword ? 'text' : 'password'}
                className="w-full border border-gray-700 px-3 py-2 pr-10 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={settings.smtpPassword} 
                onChange={e => handleSettingChange('smtpPassword', e.target.value)} 
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-400 hover:text-white"
                onClick={() => setShowSmtpPassword(!showSmtpPassword)}
              >
                {showSmtpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <button 
              onClick={testEmailSettings}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              <Mail size={16} /> Test Email
            </button>
            
            <button 
              onClick={testAnalyticsSettings}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              <Settings2 size={16} /> Test Analytics
            </button>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-gray-900 rounded-xl p-6 shadow">
        <button 
          className="flex items-center gap-2 text-white font-semibold mb-4" 
          onClick={() => setShowSecurity(v => !v)}
        >
          <Lock size={18} /> Security 
          <ChevronDown className={`ml-1 transition-transform ${showSecurity ? 'rotate-180' : ''}`} />
        </button>
        
        {showSecurity && (
          <div className="space-y-4">
            {/* Password Reset */}
            <div className="border border-gray-700 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Reset Admin Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                  type="password"
                  placeholder="Current Password"
                  className="border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={passwordReset.currentPassword}
                  onChange={e => setPasswordReset(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
                <input 
                  type="password"
                  placeholder="New Password"
                  className="border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={passwordReset.newPassword}
                  onChange={e => setPasswordReset(prev => ({ ...prev, newPassword: e.target.value }))}
                />
                <input 
                  type="password"
                  placeholder="Confirm New Password"
                  className="border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={passwordReset.confirmPassword}
                  onChange={e => setPasswordReset(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
              <button 
                onClick={resetPassword}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
              >
                Reset Password
              </button>
            </div>

            {/* Security Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-medium mb-2">Session Timeout (minutes)</label>
                <input 
                  type="number"
                  min="5"
                  max="120"
                  className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={settings.sessionTimeout} 
                  onChange={e => handleSettingChange('sessionTimeout', parseInt(e.target.value))} 
                />
              </div>
              
              <div>
                <label className="block text-gray-300 font-medium mb-2">Max Login Attempts</label>
                <input 
                  type="number"
                  min="3"
                  max="10"
                  className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={settings.maxLoginAttempts} 
                  onChange={e => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))} 
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                className="accent-blue-600" 
                checked={settings.maintenanceMode}
                onChange={e => handleSettingChange('maintenanceMode', e.target.checked)}
              /> 
              <span className="text-gray-300">Maintenance Mode</span>
            </div>
          </div>
        )}
      </section>

      {/* Feature Toggles */}
      <section className="bg-gray-900 rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ToggleRight size={18} /> Feature Toggles
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {features.map(feature => (
            <label key={feature} className="flex items-center gap-2 text-gray-300 cursor-pointer p-2 rounded hover:bg-gray-800">
              <input 
                type="checkbox" 
                checked={settings.features[feature]} 
                onChange={() => handleFeatureToggle(feature)} 
                className="accent-blue-600" 
              /> 
              {feature}
            </label>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-gray-900 rounded-xl p-6 shadow">
        <button 
          className="flex items-center gap-2 text-white font-semibold mb-4" 
          onClick={() => setShowIntegrations(v => !v)}
        >
          <Settings2 size={18} /> Integrations 
          <ChevronDown className={`ml-1 transition-transform ${showIntegrations ? 'rotate-180' : ''}`} />
        </button>
        
        {showIntegrations && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {integrations.map(integration => (
                <label key={integration} className="flex items-center gap-2 text-gray-300 cursor-pointer p-2 rounded hover:bg-gray-800">
                  <input 
                    type="checkbox" 
                    checked={settings.integrations[integration]} 
                    onChange={() => handleIntegrationToggle(integration)} 
                    className="accent-blue-600" 
                  /> 
                  {integration}
                </label>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-medium mb-2">Google Analytics ID</label>
                <input 
                  className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={settings.googleAnalyticsId} 
                  onChange={e => handleSettingChange('googleAnalyticsId', e.target.value)} 
                />
              </div>
              
              <div>
                <label className="block text-gray-300 font-medium mb-2">Facebook Pixel ID</label>
                <input 
                  className="w-full border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={settings.facebookPixelId} 
                  onChange={e => handleSettingChange('facebookPixelId', e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Notifications */}
      <section className="bg-gray-900 rounded-xl p-6 shadow">
        <button 
          className="flex items-center gap-2 text-white font-semibold mb-4" 
          onClick={() => setShowNotifications(v => !v)}
        >
          <Bell size={18} /> Notifications 
          <ChevronDown className={`ml-1 transition-transform ${showNotifications ? 'rotate-180' : ''}`} />
        </button>
        
        {showNotifications && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input 
                type="checkbox" 
                className="accent-blue-600" 
                checked={settings.emailNotifications}
                onChange={e => handleSettingChange('emailNotifications', e.target.checked)}
              /> 
              Email Notifications
            </label>
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input 
                type="checkbox" 
                className="accent-blue-600" 
                checked={settings.smsNotifications}
                onChange={e => handleSettingChange('smsNotifications', e.target.checked)}
              /> 
              SMS Notifications
            </label>
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input 
                type="checkbox" 
                className="accent-blue-600" 
                checked={settings.pushNotifications}
                onChange={e => handleSettingChange('pushNotifications', e.target.checked)}
              /> 
              Push Notifications
            </label>
          </div>
        )}
      </section>

      {/* Appearance */}
      <section className="bg-gray-900 rounded-xl p-6 shadow">
        <button 
          className="flex items-center gap-2 text-white font-semibold mb-4" 
          onClick={() => setShowAppearance(v => !v)}
        >
          <Palette size={18} /> Appearance 
          <ChevronDown className={`ml-1 transition-transform ${showAppearance ? 'rotate-180' : ''}`} />
        </button>
        
        {showAppearance && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 font-medium mb-2">Theme</label>
              <select 
                className="w-40 border border-gray-700 px-3 py-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={settings.theme} 
                onChange={e => handleSettingChange('theme', e.target.value)}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        )}
      </section>
    </div>
  );
} 