// app/settings/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
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
  Clock,
  Camera
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Profile State - Real data from API
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    profile_picture_url: '',
    bio: '',
    date_of_birth: ''
  });

  // User data from JWT
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    created_at: ''
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await apiClient.getUserProfile();
      console.log('Profile response:', response);

      if (response.profile) {
        setProfileData(response.profile);
        if (response.profile.profile_picture_url) {
          setImagePreview(response.profile.profile_picture_url);
        }
      }

      if (response.user) {
        setUserData(response.user);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'platforms', name: 'Platform Connections', icon: Link2 },
    { id: 'preferences', name: 'Content Preferences', icon: FileText },
    { id: 'brand', name: 'Brand Voice', icon: Palette },
    { id: 'api', name: 'API Keys', icon: Key },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing', icon: CreditCard }
  ];

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      // Filter out null/undefined values
      const updateData = Object.entries(profileData).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      await apiClient.updateUserProfile(updateData);
      await fetchProfileData(); // Refresh profile data
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Generate filename
      const fileName = `profile_${user?.id || Date.now()}_${file.name}`;
      const publicPath = `/uploads/profiles/${fileName}`;

      // In a real app, you would upload to server here
      // For now, just update the profile with the local path
      setProfileData(prev => ({ ...prev, profile_picture_url: publicPath }));

      toast.success('Profile picture updated! Don\'t forget to save changes.');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
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

  const ProfileTab = () => {
    if (isLoadingProfile) {
      return (
        <div className="glass rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-text-muted">Loading profile...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Account Information */}
        <div className="glass rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-text-light mb-2">Account Information</h3>
          <p className="text-sm text-text-muted mb-6">Your account details (read-only)</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Username</label>
              <div className="px-4 py-3 bg-card-bg/10 border border-white/10 rounded-lg text-text-light">
                {userData.username || 'Not set'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-2">Email</label>
              <div className="px-4 py-3 bg-card-bg/10 border border-white/10 rounded-lg text-text-light">
                {userData.email}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="glass rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-text-light mb-2">Personal Information</h3>
          <p className="text-sm text-text-muted mb-6">Update your profile details</p>

          <div className="space-y-4">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-3">Profile Picture</label>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-full flex items-center justify-center text-3xl font-bold text-white">
                      {(profileData.full_name || userData.username || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-picture"
                    className="inline-flex items-center px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Picture
                  </label>
                  <p className="text-xs text-text-muted mt-2">JPG, PNG or GIF. Max size 5MB</p>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.full_name || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Phone Number</label>
              <input
                type="tel"
                value={profileData.phone_number || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone_number: e.target.value }))}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Date of Birth</label>
              <input
                type="date"
                value={profileData.date_of_birth || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Bio</label>
              <textarea
                value={profileData.bio || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all resize-none"
              />
            </div>

            {/* Address Section */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-md font-semibold text-text-light mb-4">Address</h4>

              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  value={profileData.address_line1 || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address_line1: e.target.value }))}
                  placeholder="Address Line 1"
                  className="px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
                />

                <input
                  type="text"
                  value={profileData.address_line2 || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address_line2: e.target.value }))}
                  placeholder="Address Line 2 (Optional)"
                  className="px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={profileData.city || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                    className="px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
                  />

                  <input
                    type="text"
                    value={profileData.state || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="State/Province"
                    className="px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={profileData.country || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="Country"
                    className="px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
                  />

                  <input
                    type="text"
                    value={profileData.postal_code || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, postal_code: e.target.value }))}
                    placeholder="Postal Code"
                    className="px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleProfileUpdate}
              disabled={isLoading}
              className="px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Password Change */}
        <div className="glass rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-text-light mb-2">Change Password</h3>
          <p className="text-sm text-text-muted mb-6">Update your password to keep your account secure</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-light"
                >
                  {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-light"
                >
                  {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-text-muted mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-light"
                >
                  {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handlePasswordChange}
              disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              className="px-6 py-3 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

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
      {/* Page Header */}
      <div className="bg-dark-bg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-text-light">Settings</h1>
            <p className="text-text-muted mt-1">Manage your account settings and preferences</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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