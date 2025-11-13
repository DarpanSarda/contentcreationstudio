// app/settings/page.jsx
'use client';

import { useState } from 'react';
import {
  User,
  Bell,
  Settings as SettingsIcon,
  CreditCard,
  Key,
  Globe,
  Palette,
  FileText,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Plus,
  X,
  Mail,
  Shield,
  Zap,
  ChevronRight,
  Upload,
  Link2,
  Clock
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    timezone: 'America/New_York',
    profilePicture: null
  });

  // Platform Connections State
  const [platformConnections, setPlatformConnections] = useState([
    {
      id: 'wordpress',
      name: 'WordPress',
      status: 'connected',
      lastSync: '2 hours ago',
      connectedAt: '2024-01-01',
      settings: { autoPublish: true, category: 'Marketing' }
    },
    {
      id: 'medium',
      name: 'Medium',
      status: 'connected',
      lastSync: '3 hours ago',
      connectedAt: '2024-01-05',
      settings: { autoPublish: false }
    },
    {
      id: 'twitter',
      name: 'Twitter',
      status: 'error',
      lastSync: '1 day ago',
      errorMessage: 'API rate limit exceeded',
      connectedAt: '2024-01-03'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      status: 'connected',
      lastSync: '1 hour ago',
      connectedAt: '2024-01-08',
      settings: { autoPublish: true }
    }
  ]);

  // Content Preferences State
  const [contentPreferences, setContentPreferences] = useState({
    defaultContentType: 'blog-post',
    defaultTone: 'professional',
    defaultPlatforms: ['wordpress', 'medium'],
    defaultWordCount: 1000,
    researchDepth: 'standard',
    includeImages: true,
    defaultImages: 3
  });

  // Brand Voice State
  const [brandVoice, setBrandVoice] = useState({
    brandGuidelines: null,
    toneDescriptors: ['professional', 'helpful', 'authoritative'],
    do: ['Use data-driven insights', 'Provide actionable advice', 'Maintain consistent messaging'],
    dont: ['Use jargon', 'Overpromise results', 'Be overly casual']
  });

  // API Keys State
  const [apiKeys, setApiKeys] = useState({
    openai: 'sk-...abcd1234',
    braveSearch: 'bsc...xyz5678',
    dalle: 'sk-...efgh9012'
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    workflowComplete: true,
    publishingSuccess: true,
    publishingFailure: true,
    weeklyReport: true,
    emailNotifications: true,
    emailAddress: 'sarah@example.com'
  });

  // Billing State
  const [billing, setBilling] = useState({
    currentPlan: 'Pro',
    monthlyQuota: 50000,
    usedQuota: 23456,
    nextBillingDate: '2024-02-15',
    paymentMethod: 'Visa ending in 4242'
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'platforms', name: 'Platform Connections', icon: Link2 },
    { id: 'preferences', name: 'Content Preferences', icon: FileText },
    { id: 'brand', name: 'Brand Voice', icon: Palette },
    { id: 'api', name: 'API Keys', icon: Key },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing', icon: CreditCard }
  ];

  const handleSave = async (section) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage(`${section} settings saved successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async (platformId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPlatformConnections(prev => prev.map(platform =>
        platform.id === platformId
          ? { ...platform, status: 'connected', lastSync: 'Just now' }
          : platform
      ));
      setSuccessMessage(`${platformId} connection test successful!`);
    } catch (error) {
      console.error('Connection test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectPlatform = async (platformId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPlatformConnections(prev => prev.map(platform =>
        platform.id === platformId
          ? { ...platform, status: 'disconnected', lastSync: 'Never' }
          : platform
      ));
      setSuccessMessage(`${platformId} disconnected successfully!`);
    } catch (error) {
      console.error('Disconnect error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-accent-green';
      case 'error': return 'text-red-500';
      case 'disconnected': return 'text-text-muted';
      default: return 'text-text-muted';
    }
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="glass rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-text-light mb-6">Personal Information</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">Timezone</label>
            <select
              value={profile.timezone}
              onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {profile.name.charAt(0)}
              </div>
              <button className="px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Picture
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => handleSave('Profile')}
            disabled={isLoading}
            className="px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="glass rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-text-light mb-6">Password</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 pr-12 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-light"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => handleSave('Password')}
            disabled={isLoading}
            className="px-6 py-3 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );

  const PlatformsTab = () => (
    <div className="space-y-6">
      <div className="glass rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-text-light mb-6">Connected Platforms</h3>

        <div className="space-y-4">
          {platformConnections.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(platform.status)}`} />
                <div>
                  <h4 className="font-medium text-text-light">{platform.name}</h4>
                  <p className="text-sm text-text-muted">
                    {platform.status === 'connected'
                      ? `Last sync: ${platform.lastSync}`
                      : platform.errorMessage || 'Not connected'
                    }
                  </p>
                  {platform.connectedAt && (
                    <p className="text-xs text-text-muted">
                      Connected: {platform.connectedAt}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {platform.status === 'connected' && (
                  <button
                    onClick={() => testConnection(platform.id)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-accent-green/20 text-accent-green rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Testing...' : 'Test'}
                  </button>
                )}
                <button
                  onClick={() => disconnectPlatform(platform.id)}
                  disabled={isLoading}
                  className="px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light disabled:opacity-50"
                >
                  {platform.status === 'connected' ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-text-light mb-6">Available Platforms</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Pinterest', 'Reddit', 'Tumblr', 'YouTube'].map((platform) => (
            <div key={platform} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
              <span className="text-text-light">{platform}</span>
              <button className="px-4 py-2 border border-accent-cyan text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div className="glass rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-text-light mb-6">Notification Preferences</h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="text-text-light font-medium">Workflow Complete</p>
              <p className="text-sm text-text-muted">Get notified when content creation workflows finish</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.workflowComplete}
              onChange={(e) => setNotifications(prev => ({ ...prev, workflowComplete: e.target.checked }))}
              className="w-4 h-4 accent-accent-orange"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="text-text-light font-medium">Publishing Success</p>
              <p className="text-sm text-text-muted">Notifications when content publishes successfully</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.publishingSuccess}
              onChange={(e) => setNotifications(prev => ({ ...prev, publishingSuccess: e.target.checked }))}
              className="w-4 h-4 accent-accent-orange"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="text-text-light font-medium">Publishing Failures</p>
              <p className="text-sm text-text-muted">Alert when publishing fails and needs attention</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.publishingFailure}
              onChange={(e) => setNotifications(prev => ({ ...prev, publishingFailure: e.target.checked }))}
              className="w-4 h-4 accent-accent-orange"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="text-text-light font-medium">Weekly Reports</p>
              <p className="text-sm text-text-muted">Weekly summary of content performance</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklyReport}
              onChange={(e) => setNotifications(prev => ({ ...prev, weeklyReport: e.target.checked }))}
              className="w-4 h-4 accent-accent-orange"
            />
          </label>
        </div>

        <div className="border-t border-white/10 pt-6">
          <label className="flex items-center justify-between">
            <div>
              <p className="text-text-light font-medium">Email Notifications</p>
              <p className="text-sm text-text-muted">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={(e) => setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
              className="w-4 h-4 accent-accent-orange"
            />
          </label>

          {notifications.emailNotifications && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-text-light mb-2">Email Address</label>
              <input
                type="email"
                value={notifications.emailAddress}
                onChange={(e) => setNotifications(prev => ({ ...prev, emailAddress: e.target.value }))}
                className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => handleSave('Notifications')}
            disabled={isLoading}
            className="px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );

  const APITab = () => (
    <div className="space-y-6">
      <div className="glass rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-text-light mb-6">API Configuration</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">OpenAI API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeys.openai}
                onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                className="flex-1 px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
              />
              <button className="px-4 py-3 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-colors">
                Test
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">Brave Search API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeys.braveSearch}
                onChange={(e) => setApiKeys(prev => ({ ...prev, braveSearch: e.target.value }))}
                className="flex-1 px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
              />
              <button className="px-4 py-3 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-colors">
                Test
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">DALL-E API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeys.dalle}
                onChange={(e) => setApiKeys(prev => ({ ...prev, dalle: e.target.value }))}
                className="flex-1 px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
              />
              <button className="px-4 py-3 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-colors">
                Test
              </button>
            </div>
          </div>
        </div>

        <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-accent-orange">API Security</p>
              <p className="text-sm text-text-muted mt-1">
                Your API keys are encrypted and stored securely. Never share your API keys with anyone.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => handleSave('API Keys')}
            disabled={isLoading}
            className="px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );

  const BillingTab = () => (
    <div className="space-y-6">
      <div className="glass rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-text-light mb-6">Current Plan</h3>

        <div className="bg-accent-green/20 border border-accent-green/30 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-text-light">{billing.currentPlan} Plan</h4>
              <p className="text-sm text-text-muted">Next billing: {billing.nextBillingDate}</p>
            </div>
            <Zap className="w-12 h-12 text-accent-green" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-muted mb-1">Monthly Quota</p>
              <p className="text-lg font-bold text-text-light">{billing.monthlyQuota.toLocaleString()} words</p>
            </div>
            <div>
              <p className="text-sm text-text-muted mb-1">Used This Month</p>
              <p className="text-lg font-bold text-accent-cyan">{billing.usedQuota.toLocaleString()} words</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-muted">Usage</span>
              <span className="text-text-muted">{Math.round((billing.usedQuota / billing.monthlyQuota) * 100)}%</span>
            </div>
            <div className="w-full bg-card-bg/50 rounded-full h-2">
              <div
                className="h-2 bg-accent-cyan rounded-full transition-all"
                style={{ width: `${(billing.usedQuota / billing.monthlyQuota) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-text-light">Payment Method</h4>
          <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-text-muted" />
              <span className="text-text-light">{billing.paymentMethod}</span>
            </div>
            <button className="px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light">
              Update
            </button>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-text-light mb-6">Plan Options</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Starter',
              price: '$29',
              features: ['10,000 words/month', 'Basic AI tools', 'Email support', '3 platforms'],
              current: false
            },
            {
              name: 'Pro',
              price: '$79',
              features: ['50,000 words/month', 'Advanced AI tools', 'Priority support', '10 platforms'],
              current: true
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              features: ['Unlimited words', 'Custom AI models', 'Dedicated support', 'Unlimited platforms'],
              current: false
            }
          ].map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-xl p-6 ${
                plan.current
                  ? 'border-accent-orange bg-accent-orange/10'
                  : 'border-white/20 hover:border-accent-cyan/50'
              }`}
            >
              <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-text-light mb-2">{plan.name}</h4>
                <p className="text-2xl font-bold text-accent-orange mb-1">{plan.price}</p>
                <p className="text-sm text-text-muted">per month</p>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-text-light">
                    <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  plan.current
                    ? 'bg-card-bg/20 text-text-muted cursor-not-allowed'
                    : 'bg-accent-orange hover:bg-opacity-90 text-white hover:scale-105'
                }`}
                disabled={plan.current}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabsContent = {
    profile: <ProfileTab />,
    platforms: <PlatformsTab />,
    preferences: <div className="glass rounded-xl border border-white/10 p-6">
      <h3 className="text-lg font-bold text-text-light mb-6">Content Preferences</h3>
      <p className="text-text-muted">Content preferences coming soon...</p>
    </div>,
    brand: <div className="glass rounded-xl border border-white/10 p-6">
      <h3 className="text-lg font-bold text-text-light mb-6">Brand Voice</h3>
      <p className="text-text-muted">Brand voice settings coming soon...</p>
    </div>,
    api: <APITab />,
    notifications: <NotificationsTab />,
    billing: <BillingTab />
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="sticky top-16 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-text-light">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 glass rounded-xl border border-accent-green/30 bg-accent-green/10 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-accent-green" />
              <p className="text-accent-green font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="glass rounded-xl border border-white/10 p-4">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-accent-orange/20 text-accent-orange'
                        : 'text-text-light hover:text-accent-cyan hover:bg-card-bg/20'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                    <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                      activeTab === tab.id ? 'rotate-90' : ''
                    }`} />
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {tabsContent[activeTab]}
          </div>
        </div>
      </main>
    </div>
  );
}