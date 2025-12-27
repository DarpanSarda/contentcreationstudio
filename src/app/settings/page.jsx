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
import DraggablePriorityList from '@/components/settings/DraggablePriorityList';
import websocketNotificationService from '@/services/websocketNotificationService';

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
  const [platformConnections, setPlatformConnections] = useState([]);
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(true);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [platformCredentials, setPlatformCredentials] = useState({
    site_url: '',
    username: '',
    password: '',
    api_key: ''
  });

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

  // Brand Voice State - Dynamic from API
  const [brandVoice, setBrandVoice] = useState({
    brand_guidelines: '',
    tone_descriptors: [],
    do: [],
    dont: []
  });

  // API Keys State - Dynamic from API (masked)
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    groq: '',
    brave_search: '',
    dalle: '',
    anthropic: '',
    google: '',
    stability_ai: '',
    deepseek: '',
    tavily: '',
    serper: ''
  });

  // API Priority State
  const [apiPriorities, setApiPriorities] = useState({
    llm: [
      { id: 'groq', priority: 1, enabled: true },
      { id: 'openai', priority: 2, enabled: false },
      { id: 'anthropic', priority: 3, enabled: false },
      { id: 'deepseek', priority: 4, enabled: false },
      { id: 'google', priority: 5, enabled: false }
    ],
    search: [
      { id: 'brave_search', priority: 1, enabled: false },
      { id: 'tavily', priority: 2, enabled: false },
      { id: 'serper', priority: 3, enabled: false }
    ]
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    workflowComplete: true,
    publishingSuccess: true,
    publishingFailure: true,
    weeklyReport: true,
    emailNotifications: true,
    emailAddress: user?.email || ''
  });

  // Billing State - Dynamic from API
  const [billing, setBilling] = useState({
    currentPlan: '',
    monthlyQuota: 0,
    usedQuota: 0,
    nextBillingDate: null,
    paymentMethod: '',
    billingEmail: '',
    status: ''
  });

  // Billing Usage State
  const [billingUsage, setBillingUsage] = useState({
    used: 0,
    limit: 0,
    percentage: 0,
    resetDate: null,
    breakdown: {
      workflows: 0,
      content_pieces: 0,
      publications: 0
    }
  });

  // Fetch profile data, settings, and platform credentials on component mount
  useEffect(() => {
    fetchProfileData();
    fetchUserSettings();
    fetchPlatformStatus();
    fetchBrandVoice();
    fetchAPIKeys();
    fetchBillingInfo();
    fetchBillingUsage();
  }, []);

  const fetchProfileData = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await apiClient.getUserProfile();


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

  const fetchUserSettings = async () => {
    try {
      const response = await apiClient.getUserSettings();


      if (response.settings) {
        // Update notifications state
        if (response.settings.notifications) {
          setNotifications(prev => ({
            ...prev,
            emailNotifications: response.settings.notifications.email || false,
            pushNotifications: response.settings.notifications.push || false
          }));
        }

        // Update preferences from settings
        if (response.settings.preferences) {
          setContentPreferences(prev => ({
            ...prev,
            ...response.settings.preferences
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const fetchPlatformStatus = async () => {
    setIsLoadingPlatforms(true);
    try {
      const response = await apiClient.getPlatformsStatus();


      if (response.platforms) {
        // Map backend response to frontend format
        const mappedPlatforms = Object.entries(response.platforms).map(([key, data]) => ({
          id: key,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          status: data.connected ? 'connected' : 'disconnected',
          lastSync: data.updated_at ? new Date(data.updated_at).toLocaleString() : 'Never',
          connectedAt: data.configured_at ? new Date(data.configured_at).toLocaleDateString() : 'N/A',
          siteUrl: data.site_url || '',
          username: data.username || '',
          settings: {}
        }));
        setPlatformConnections(mappedPlatforms);
      }
    } catch (error) {
      console.error('Failed to fetch platform status:', error);
    } finally {
      setIsLoadingPlatforms(false);
    }
  };

  const fetchBrandVoice = async () => {
    try {
      const response = await apiClient.getBrandVoice();


      if (response && response.success) {
        setBrandVoice({
          brand_guidelines: response.brand_guidelines || '',
          tone_descriptors: response.tone_descriptors || [],
          do: response.do || [],
          dont: response.dont || []
        });
      }
    } catch (error) {
      console.error('Failed to fetch brand voice:', error);
      // Keep empty state on error
    }
  };

  const fetchAPIKeys = async () => {
    try {
      const response = await apiClient.getAPIKeys();


      if (response && response.success) {
        setApiKeys({
          openai: response.openai || '',
          groq: response.groq || '',
          brave_search: response.brave_search || '',
          dalle: response.dalle || '',
          anthropic: response.anthropic || '',
          google: response.google || '',
          stability_ai: response.stability_ai || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      // Keep empty state on error
    }
  };

  const fetchBillingInfo = async () => {
    try {
      const response = await apiClient.getBillingInfo();


      if (response && response.success) {
        setBilling({
          currentPlan: response.current_plan || 'Free',
          monthlyQuota: response.monthly_quota || 0,
          nextBillingDate: response.next_billing_date,
          paymentMethod: response.payment_method || 'No payment method',
          billingEmail: response.billing_email || '',
          status: response.status || 'active'
        });
      }
    } catch (error) {
      console.error('Failed to fetch billing info:', error);
      // Keep empty state on error
    }
  };

  const fetchBillingUsage = async () => {
    try {
      const response = await apiClient.getBillingUsage();


      if (response && response.success) {
        setBillingUsage({
          used: response.used || 0,
          limit: response.limit || 0,
          percentage: response.percentage || 0,
          resetDate: response.reset_date,
          breakdown: response.breakdown || {
            workflows: 0,
            content_pieces: 0,
            publications: 0
          }
        });

        // Also update usedQuota in billing state for display
        setBilling(prev => ({
          ...prev,
          usedQuota: response.used || 0
        }));
      }
    } catch (error) {
      console.error('Failed to fetch billing usage:', error);
      // Keep empty state on error
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

  const testConnection = async (platformId, credentials) => {
    setIsLoading(true);
    try {
      await apiClient.testPlatformCredentials(platformId, credentials);

      // Update the platform status locally
      setPlatformConnections(prev => prev.map(platform =>
        platform.id === platformId
          ? { ...platform, status: 'connected', lastSync: 'Just now' }
          : platform
      ));
    } catch (error) {
      console.error('Connection test error:', error);
      // Error toast already shown by apiClient
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectPlatform = async (platformId) => {
    setIsLoading(true);
    try {
      await apiClient.disconnectPlatform(platformId);

      // Refresh platform status
      await fetchPlatformStatus();
    } catch (error) {
      console.error('Disconnect error:', error);
      // Error toast already shown by apiClient
    } finally {
      setIsLoading(false);
    }
  };

  const connectPlatform = async (platformId, credentials, settings = null) => {
    setIsLoading(true);
    try {
      await apiClient.connectPlatform(platformId, credentials, settings);

      // Refresh platform status
      await fetchPlatformStatus();
    } catch (error) {
      console.error('Connect platform error:', error);
      // Error toast already shown by apiClient
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationsUpdate = async () => {
    setIsLoading(true);
    try {
      await apiClient.updateUserSettings({
        notifications: {
          email: notifications.emailNotifications,
          push: notifications.pushNotifications
        }
      });
    } catch (error) {
      console.error('Update notifications error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setIsLoading(true);
    try {
      await apiClient.updateUserSettings({
        preferences: contentPreferences
      });
      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('Update preferences error:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrandVoiceUpdate = async () => {
    setIsLoading(true);
    try {
      await apiClient.updateBrandVoice(brandVoice);
      toast.success('Brand voice updated successfully');
      // Refetch to confirm
      await fetchBrandVoice();
    } catch (error) {
      console.error('Update brand voice error:', error);
      toast.error('Failed to update brand voice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAPIKeysUpdate = async () => {
    setIsLoading(true);
    try {
      // Only send non-empty keys
      const keysToUpdate = Object.entries(apiKeys).reduce((acc, [key, value]) => {
        if (value && value.trim() !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      if (Object.keys(keysToUpdate).length === 0) {
        toast.error('Please enter at least one API key');
        setIsLoading(false);
        return;
      }

      await apiClient.updateAPIKeys(keysToUpdate);
      toast.success('API keys updated successfully');
      // Refetch to get masked keys
      await fetchAPIKeys();
    } catch (error) {
      console.error('Update API keys error:', error);
      toast.error('Failed to update API keys');
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

  const PlatformsTab = () => {
    if (isLoadingPlatforms) {
      return (
        <div className="glass rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-text-muted">Loading platform connections...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="glass rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-text-light mb-6">Connected Platforms</h3>

          {platformConnections.length === 0 ? (
            <div className="text-center py-8">
              <Link2 className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">No platforms connected yet</p>
              <p className="text-sm text-text-muted mt-1">Connect platforms below to start publishing</p>
            </div>
          ) : (
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
          )}
        </div>

        {/* <div className="glass rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-text-light mb-6">Available Platforms</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['WordPress', 'Medium', 'Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((platformName) => {
              const platformId = platformName.toLowerCase();
              const isConnected = platformConnections.some(p => p.id === platformId);

              return (
                <div key={platformName} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                  <span className="text-text-light">{platformName}</span>
                  {isConnected ? (
                    <span className="text-sm text-accent-green">Connected</span>
                  ) : (
                    <button
                      className="px-4 py-2 border border-accent-cyan text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors"
                      onClick={() => {
                        setSelectedPlatform(platformId);
                        setPlatformCredentials({ site_url: '', username: '', password: '', api_key: '' });
                        setShowPlatformModal(true);
                      }}
                    >
                      Connect
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div> */}

        {/* Platform Connection Modal */}
        {showPlatformModal && selectedPlatform && (
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="glass rounded-xl border border-white/10 p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text-light">
                  Connect {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
                </h3>
                <button
                  onClick={() => setShowPlatformModal(false)}
                  className="text-text-muted hover:text-text-light"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedPlatform === 'wordpress' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">Site URL</label>
                      <input
                        type="url"
                        value={platformCredentials.site_url}
                        onChange={(e) => setPlatformCredentials(prev => ({ ...prev, site_url: e.target.value }))}
                        placeholder="https://your-site.com"
                        className="w-full px-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">Username</label>
                      <input
                        type="text"
                        value={platformCredentials.username}
                        onChange={(e) => setPlatformCredentials(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="admin"
                        className="w-full px-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">Application Password</label>
                      <input
                        type="password"
                        value={platformCredentials.password}
                        onChange={(e) => setPlatformCredentials(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                        className="w-full px-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light"
                      />
                      <p className="text-xs text-text-muted mt-1">
                        Generate an application password from WordPress Users → Profile → Application Passwords
                      </p>
                    </div>
                  </>
                )}

                {(selectedPlatform === 'twitter' || selectedPlatform === 'medium') && (
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">API Key</label>
                    <input
                      type="text"
                      value={platformCredentials.api_key}
                      onChange={(e) => setPlatformCredentials(prev => ({ ...prev, api_key: e.target.value }))}
                      placeholder="Enter API key"
                      className="w-full px-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light"
                    />
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={async () => {
                      await testConnection(selectedPlatform, platformCredentials);
                    }}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light disabled:opacity-50"
                  >
                    {isLoading ? 'Testing...' : 'Test Connection'}
                  </button>
                  <button
                    onClick={async () => {
                      await connectPlatform(selectedPlatform, platformCredentials);
                      setShowPlatformModal(false);
                    }}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // const NotificationsTab = () => (
  //   <div className="space-y-6">
  //     <div className="glass rounded-xl border border-white/10 p-6">
  //       <h3 className="text-lg font-bold text-text-light mb-6">Notification Preferences</h3>

  //       <div className="space-y-4">
  //         <label className="flex items-center justify-between">
  //           <div>
  //             <p className="text-text-light font-medium">Workflow Complete</p>
  //             <p className="text-sm text-text-muted">Get notified when content creation workflows finish</p>
  //           </div>
  //           <input
  //             type="checkbox"
  //             checked={notifications.workflowComplete}
  //             onChange={(e) => setNotifications(prev => ({ ...prev, workflowComplete: e.target.checked }))}
  //             className="w-4 h-4 accent-accent-orange"
  //           />
  //         </label>

  //         <label className="flex items-center justify-between">
  //           <div>
  //             <p className="text-text-light font-medium">Publishing Success</p>
  //             <p className="text-sm text-text-muted">Notifications when content publishes successfully</p>
  //           </div>
  //           <input
  //             type="checkbox"
  //             checked={notifications.publishingSuccess}
  //             onChange={(e) => setNotifications(prev => ({ ...prev, publishingSuccess: e.target.checked }))}
  //             className="w-4 h-4 accent-accent-orange"
  //           />
  //         </label>

  //         <label className="flex items-center justify-between">
  //           <div>
  //             <p className="text-text-light font-medium">Publishing Failures</p>
  //             <p className="text-sm text-text-muted">Alert when publishing fails and needs attention</p>
  //           </div>
  //           <input
  //             type="checkbox"
  //             checked={notifications.publishingFailure}
  //             onChange={(e) => setNotifications(prev => ({ ...prev, publishingFailure: e.target.checked }))}
  //             className="w-4 h-4 accent-accent-orange"
  //           />
  //         </label>

  //         <label className="flex items-center justify-between">
  //           <div>
  //             <p className="text-text-light font-medium">Weekly Reports</p>
  //             <p className="text-sm text-text-muted">Weekly summary of content performance</p>
  //           </div>
  //           <input
  //             type="checkbox"
  //             checked={notifications.weeklyReport}
  //             onChange={(e) => setNotifications(prev => ({ ...prev, weeklyReport: e.target.checked }))}
  //             className="w-4 h-4 accent-accent-orange"
  //           />
  //         </label>
  //       </div>

  //       <div className="border-t border-white/10 pt-6">
  //         <label className="flex items-center justify-between">
  //           <div>
  //             <p className="text-text-light font-medium">Email Notifications</p>
  //             <p className="text-sm text-text-muted">Receive notifications via email</p>
  //           </div>
  //           <input
  //             type="checkbox"
  //             checked={notifications.emailNotifications}
  //             onChange={(e) => setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
  //             className="w-4 h-4 accent-accent-orange"
  //           />
  //         </label>

  //         {notifications.emailNotifications && (
  //           <div className="mt-4">
  //             <label className="block text-sm font-medium text-text-light mb-2">Email Address</label>
  //             <input
  //               type="email"
  //               value={notifications.emailAddress}
  //               onChange={(e) => setNotifications(prev => ({ ...prev, emailAddress: e.target.value }))}
  //               className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
  //             />
  //           </div>
  //         )}
  //       </div>

  //       <div className="flex justify-end mt-6">
  //         <button
  //           onClick={handleNotificationsUpdate}
  //           disabled={isLoading}
  //           className="px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
  //         >
  //           {isLoading ? 'Saving...' : 'Save Changes'}
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );


  const APITab = () => (
    <div className="space-y-6">
      {/* LLM Generation (Text) */}
      <div className="glass rounded-xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-text-light">LLM Generation (Text)</h3>
          <span className="px-2 py-0.5 bg-accent-cyan/20 text-accent-cyan text-xs font-medium rounded-full">
            Active
          </span>
        </div>
        <p className="text-sm text-text-muted mb-6">Configure API keys for text generation. Keys are encrypted and stored securely.</p>

        <div className="space-y-4">
          {/* Groq - Default */}
          <div>
            <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
              Groq API Key
              <span className="text-text-muted font-normal">(Fast inference)</span>
              <span className="ml-auto px-2 py-0.5 bg-green-500/20 text-green-500 text-xs font-medium rounded-full">
                ✅ Default
              </span>
            </label>
            <input
              type="password"
              value={apiKeys.groq || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, groq: e.target.value }))}
              placeholder="gsk-..."
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            />
            <p className="text-xs text-text-muted mt-1">
              Get your key from: <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">https://console.groq.com</a>
            </p>
          </div>

          {/* OpenAI - Optional */}
          <div>
            <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
              OpenAI API Key
              <span className="text-text-muted font-normal">(GPT-4, GPT-3.5)</span>
              <span className="ml-auto px-2 py-0.5 bg-card-bg/40 text-text-muted text-xs font-medium rounded-full">
                Optional
              </span>
            </label>
            <input
              type="password"
              value={apiKeys.openai || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
              placeholder="sk-proj-..."
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            />
            <p className="text-xs text-text-muted mt-1">
              Get your key from: <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">https://platform.openai.com</a>
            </p>
          </div>

          {/* Anthropic - Optional */}
          <div>
            <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
              Anthropic API Key
              <span className="text-text-muted font-normal">(Claude)</span>
              <span className="ml-auto px-2 py-0.5 bg-card-bg/40 text-text-muted text-xs font-medium rounded-full">
                Optional
              </span>
            </label>
            <input
              type="password"
              value={apiKeys.anthropic || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, anthropic: e.target.value }))}
              placeholder="sk-ant-..."
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            />
            <p className="text-xs text-text-muted mt-1">
              Get your key from: <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">https://console.anthropic.com</a>
            </p>
          </div>

          {/* DeepSeek - Optional */}
          <div>
            <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
              DeepSeek API Key
              <span className="text-text-muted font-normal">(DeepSeek models)</span>
              <span className="ml-auto px-2 py-0.5 bg-card-bg/40 text-text-muted text-xs font-medium rounded-full">
                Optional
              </span>
            </label>
            <input
              type="password"
              value={apiKeys.deepseek || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, deepseek: e.target.value }))}
              placeholder="sk-..."
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            />
            <p className="text-xs text-text-muted mt-1">
              Get your key from: <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">https://platform.deepseek.com</a>
            </p>
          </div>

          {/* Google Gemini - Optional */}
          <div>
            <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
              Google Gemini API Key
              <span className="text-text-muted font-normal">(Gemini Pro)</span>
              <span className="ml-auto px-2 py-0.5 bg-card-bg/40 text-text-muted text-xs font-medium rounded-full">
                Optional
              </span>
            </label>
            <input
              type="password"
              value={apiKeys.google || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, google: e.target.value }))}
              placeholder="AIza..."
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            />
            <p className="text-xs text-text-muted mt-1">
              Get your key from: <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">https://aistudio.google.com</a>
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-accent-cyan/10 rounded-lg border border-accent-cyan/20">
          <p className="text-sm text-accent-cyan">
            <strong>Minimum Required:</strong> 1 key (Groq - currently your default)<br />
            <strong>Maximum Possible:</strong> 5 keys (all providers)
          </p>
        </div>
      </div>

      {/* Web Search APIs */}
      <div className="glass rounded-xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-text-light">Web Search</h3>
          <span className="px-2 py-0.5 bg-accent-cyan/20 text-accent-cyan text-xs font-medium rounded-full">
            Active
          </span>
        </div>
        <p className="text-sm text-text-muted mb-6">Configure API keys for web search and research capabilities.</p>

        <div className="space-y-4">
          {/* Brave Search */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Brave Search API Key
              <span className="text-text-muted ml-2 font-normal">(Web search)</span>
            </label>
            <input
              type="password"
              value={apiKeys.brave_search || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, brave_search: e.target.value }))}
              placeholder="BSA..."
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            />
          </div>

          {/* Tavily Search */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Tavily Search API Key
              <span className="text-text-muted ml-2 font-normal">(Web search)</span>
            </label>
            <input
              type="password"
              value={apiKeys.tavily || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, tavily: e.target.value }))}
              placeholder="tvly..."
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            />
          </div>

          {/* Serper Search */}
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Serper Search API Key
              <span className="text-text-muted ml-2 font-normal">(Google search)</span>
            </label>
            <input
              type="password"
              value={apiKeys.serper || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, serper: e.target.value }))}
              placeholder="..."
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            />
          </div>
        </div>
      </div>

      {/* API Priority Management */}
      <div className="glass rounded-xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-text-light">API Priority & Fallback</h3>
          <span className="px-2 py-0.5 bg-accent-purple/20 text-accent-purple text-xs font-medium rounded-full">
            Smart Routing
          </span>
        </div>
        <p className="text-sm text-text-muted mb-6">
          Set priority order for your API providers. The system will automatically fallback to the next provider if one fails.
        </p>

        {/* LLM Priority */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-text-light mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-yellow" />
            LLM Providers Priority
          </h4>
          <DraggablePriorityList
            providers={apiPriorities.llm}
            apiKeys={apiKeys}
            onReorder={(reordered) => {
              setApiPriorities(prev => ({
                ...prev,
                llm: reordered
              }));
            }}
            category="llm"
          />
        </div>

        {/* Search Priority */}
        <div>
          <h4 className="text-md font-semibold text-text-light mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-accent-cyan" />
            Search Providers Priority
          </h4>
          <DraggablePriorityList
            providers={apiPriorities.search}
            apiKeys={apiKeys}
            onReorder={(reordered) => {
              setApiPriorities(prev => ({
                ...prev,
                search: reordered
              }));
            }}
            category="search"
          />
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-accent-purple/10 rounded-lg border border-accent-purple/20">
          <p className="text-sm text-accent-purple mb-2">
            <strong>How it works:</strong>
          </p>
          <ul className="text-xs text-text-muted space-y-1 ml-4">
            <li>• Priority 1 provider is tried first</li>
            <li>• If it fails, system automatically tries Priority 2</li>
            <li>• Continues down the list until a provider succeeds</li>
            <li>• Only configured providers (with API keys) are shown</li>
          </ul>
        </div>
      </div>

      {/* Image Generation - Coming Soon */}
      <div className="glass rounded-xl border border-white/10 p-6 opacity-60">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-text-light">Image Generation</h3>
          <span className="px-2 py-0.5 bg-accent-yellow/20 text-accent-yellow text-xs font-medium rounded-full">
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-text-muted mb-6">AI-powered image generation will be available soon.</p>

        <div className="space-y-4">
          {/* Stability AI */}
          <div>
            <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
              Stability AI API Key
              <span className="text-text-muted font-normal">(Stable Diffusion)</span>
              <span className="ml-auto px-2 py-0.5 bg-green-500/20 text-green-500 text-xs font-medium rounded-full">
                ✅ Default
              </span>
            </label>
            <input
              type="password"
              disabled
              placeholder="Image generation coming soon..."
              className="w-full px-4 py-3 bg-card-bg/10 border border-white/10 rounded-lg text-text-muted cursor-not-allowed"
            />
            <p className="text-xs text-text-muted mt-1">
              Get your key from: <a href="https://platform.stability.ai" target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">https://platform.stability.ai</a>
            </p>
          </div>

          {/* Google Imagen */}
          <div>
            <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
              Google Imagen API Key
              <span className="text-text-muted font-normal">(Imagen)</span>
              <span className="ml-auto px-2 py-0.5 bg-card-bg/40 text-text-muted text-xs font-medium rounded-full">
                Optional
              </span>
            </label>
            <input
              type="password"
              disabled
              placeholder="Image generation coming soon..."
              className="w-full px-4 py-3 bg-card-bg/10 border border-white/10 rounded-lg text-text-muted cursor-not-allowed"
            />
            <p className="text-xs text-text-muted mt-1">
              Uses same key as Google Gemini
            </p>
          </div>

          {/* OpenAI DALL-E */}
          <div>
            <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
              OpenAI DALL-E API Key
              <span className="text-text-muted font-normal">(DALL-E 3)</span>
              <span className="ml-auto px-2 py-0.5 bg-card-bg/40 text-text-muted text-xs font-medium rounded-full">
                Optional
              </span>
            </label>
            <input
              type="password"
              disabled
              placeholder="Image generation coming soon..."
              className="w-full px-4 py-3 bg-card-bg/10 border border-white/10 rounded-lg text-text-muted cursor-not-allowed"
            />
            <p className="text-xs text-text-muted mt-1">
              Uses same key as OpenAI
            </p>
          </div>

          {/* Replicate */}
          <div>
            <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
              Replicate API Token
              <span className="text-text-muted font-normal">(Multiple models)</span>
              <span className="ml-auto px-2 py-0.5 bg-card-bg/40 text-text-muted text-xs font-medium rounded-full">
                Optional
              </span>
            </label>
            <input
              type="password"
              disabled
              placeholder="Image generation coming soon..."
              className="w-full px-4 py-3 bg-card-bg/10 border border-white/10 rounded-lg text-text-muted cursor-not-allowed"
            />
            <p className="text-xs text-text-muted mt-1">
              Get your token from: <a href="https://replicate.com" target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">https://replicate.com</a>
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-accent-yellow/10 rounded-lg border border-accent-yellow/20">
          <p className="text-sm text-accent-yellow">
            <strong>Minimum Required:</strong> 1 key (Stability AI - recommended default)<br />
            <strong>Maximum Possible:</strong> 4 keys (all providers)
          </p>
        </div>
      </div>

      {/* Video Generation - Coming Soon */}
      <div className="glass rounded-xl border border-white/10 p-6 opacity-60">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold text-text-light">Video Generation</h3>
          <span className="px-2 py-0.5 bg-accent-yellow/20 text-accent-yellow text-xs font-medium rounded-full">
            Coming Soon
          </span>
        </div>
        <p className="text-sm text-text-muted mb-6">AI-powered video generation will be available soon.</p>

        <div className="space-y-4">
          {/* Stability AI */}
          <div>
            <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
              Stability AI API Key
              <span className="text-text-muted font-normal">(Video generation)</span>
              <span className="ml-auto px-2 py-0.5 bg-green-500/20 text-green-500 text-xs font-medium rounded-full">
                ✅ Default
              </span>
            </label>
            <input
              type="password"
              disabled
              placeholder="Video generation coming soon..."
              className="w-full px-4 py-3 bg-card-bg/10 border border-white/10 rounded-lg text-text-muted cursor-not-allowed"
            />
            <p className="text-xs text-text-muted mt-1">
              Uses same key as Stability AI for images
            </p>
          </div>

          {/* Replicate */}
          <div>
            <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
              Replicate API Token
              <span className="text-text-muted font-normal">(Video models)</span>
              <span className="ml-auto px-2 py-0.5 bg-card-bg/40 text-text-muted text-xs font-medium rounded-full">
                Optional
              </span>
            </label>
            <input
              type="password"
              disabled
              placeholder="Video generation coming soon..."
              className="w-full px-4 py-3 bg-card-bg/10 border border-white/10 rounded-lg text-text-muted cursor-not-allowed"
            />
            <p className="text-xs text-text-muted mt-1">
              Uses same token as Replicate for images
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-accent-yellow/10 rounded-lg border border-accent-yellow/20">
          <p className="text-sm text-accent-yellow">
            <strong>Minimum Required:</strong> 1 key (Stability AI)<br />
            <strong>Maximum Possible:</strong> 2 keys (both providers)
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAPIKeysUpdate}
          disabled={isLoading}
          className="px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Saving...' : 'Save API Keys'}
        </button>
      </div>
    </div>
  );

  const NotificationsTab = () => {
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [isRequestingPermission, setIsRequestingPermission] = useState(false);
    const [isSendingTest, setIsSendingTest] = useState(false);
    const [notificationPrefs, setNotificationPrefs] = useState({
      content_published: true,
      workflow_completed: true,
      agent_updates: true,
      platform_issues: true,
      billing_alerts: true,
      push_notifications: true
    });

    useEffect(() => {
      // Get current permission status
      const permission = websocketNotificationService.getPermissionStatus();
      setNotificationPermission(permission);

      // Fetch notification preferences
      fetchNotificationPreferences();
    }, []);

    const fetchNotificationPreferences = async () => {
      try {
        const response = await apiClient.getNotificationPreferences();
        if (response && response.success) {
          setNotificationPrefs(response.preferences);
        }
      } catch (error) {
        console.error('Failed to fetch notification preferences:', error);
      }
    };

    const handleRequestPermission = async () => {
      setIsRequestingPermission(true);
      try {
        const granted = await websocketNotificationService.requestPermission();
        if (granted) {
          setNotificationPermission('granted');
        } else {
          setNotificationPermission('denied');
        }
        toast.success('Notifications enabled successfully!');
      } catch (error) {
        console.error('Failed to request permission:', error);
        toast.error('Failed to enable notifications. Please check your browser settings.');
      } finally {
        setIsRequestingPermission(false);
      }
    };

    const handleSendTestNotification = async () => {
      setIsSendingTest(true);
      try {
        const response = await apiClient.sendTestNotification();
        if (response && response.success) {
          toast.success('Test notification sent!');
        }
      } catch (error) {
        console.error('Failed to send test notification:', error);
        toast.error('Failed to send test notification');
      } finally {
        setIsSendingTest(false);
      }
    };

    const handleUpdatePreferences = async () => {
      setIsLoading(true);
      try {
        await apiClient.updateNotificationPreferences(notificationPrefs);
        toast.success('Notification preferences updated');
      } catch (error) {
        console.error('Failed to update preferences:', error);
        toast.error('Failed to update preferences');
      } finally {
        setIsLoading(false);
      }
    };

    const getPermissionStatusColor = () => {
      switch (notificationPermission) {
        case 'granted': return 'text-accent-green';
        case 'denied': return 'text-red-500';
        default: return 'text-text-muted';
      }
    };

    const getPermissionStatusText = () => {
      switch (notificationPermission) {
        case 'granted': return 'Enabled';
        case 'denied': return 'Blocked';
        case 'unsupported': return 'Not Supported';
        default: return 'Not Enabled';
      }
    };

    return (
      <div className="space-y-6">
        {/* Push Notifications */}
        <div className="glass rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-text-light mb-2">Push Notifications</h3>
          <p className="text-sm text-text-muted mb-6">
            Enable browser notifications to stay updated on your content creation activities
          </p>

          {/* Permission Status */}
          <div className="bg-card-bg/20 border border-white/10 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-light">Notification Status</p>
                <p className={`text-sm ${getPermissionStatusColor()} mt-1`}>
                  {getPermissionStatusText()}
                </p>
              </div>
              <Bell className={`w-6 h-6 ${getPermissionStatusColor()}`} />
            </div>
          </div>

          {/* Request Permission Button */}
          {notificationPermission !== 'granted' && notificationPermission !== 'unsupported' && (
            <button
              onClick={handleRequestPermission}
              disabled={isRequestingPermission || notificationPermission === 'denied'}
              className="w-full px-6 py-3 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
            >
              <Bell className="w-5 h-5" />
              {isRequestingPermission ? 'Requesting...' : 'Enable Notifications'}
            </button>
          )}

          {notificationPermission === 'denied' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-500">Notifications Blocked</p>
                  <p className="text-sm text-text-muted mt-1">
                    You've blocked notifications for this site. Please enable them in your browser settings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Test Notification Button */}
          {notificationPermission === 'granted' && (
            <button
              onClick={handleSendTestNotification}
              disabled={isSendingTest}
              className="w-full px-6 py-3 bg-card-bg/20 border border-white/20 hover:border-accent-cyan/50 text-text-light rounded-lg font-medium transition-all hover:bg-card-bg/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              {isSendingTest ? 'Sending...' : 'Send Test Notification'}
            </button>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="glass rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-text-light mb-2">Notification Preferences</h3>
          <p className="text-sm text-text-muted mb-6">
            Choose which notifications you want to receive
          </p>

          <div className="space-y-4">
            {/* Content Published */}
            <label className="flex items-center justify-between p-4 bg-card-bg/10 border border-white/10 rounded-lg hover:border-accent-cyan/30 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-medium text-text-light">Content Published</p>
                <p className="text-xs text-text-muted mt-1">When your content is successfully published to platforms</p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.content_published}
                onChange={(e) => setNotificationPrefs(prev => ({ ...prev, content_published: e.target.checked }))}
                className="w-5 h-5 accent-accent-cyan"
              />
            </label>

            {/* Workflow Completed */}
            <label className="flex items-center justify-between p-4 bg-card-bg/10 border border-white/10 rounded-lg hover:border-accent-cyan/30 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-medium text-text-light">Workflow Completed</p>
                <p className="text-xs text-text-muted mt-1">When content generation workflows finish</p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.workflow_completed}
                onChange={(e) => setNotificationPrefs(prev => ({ ...prev, workflow_completed: e.target.checked }))}
                className="w-5 h-5 accent-accent-cyan"
              />
            </label>

            {/* Agent Updates */}
            <label className="flex items-center justify-between p-4 bg-card-bg/10 border border-white/10 rounded-lg hover:border-accent-cyan/30 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-medium text-text-light">Agent Updates</p>
                <p className="text-xs text-text-muted mt-1">Updates from research, writing, and publishing agents</p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.agent_updates}
                onChange={(e) => setNotificationPrefs(prev => ({ ...prev, agent_updates: e.target.checked }))}
                className="w-5 h-5 accent-accent-cyan"
              />
            </label>

            {/* Platform Issues */}
            <label className="flex items-center justify-between p-4 bg-card-bg/10 border border-white/10 rounded-lg hover:border-accent-cyan/30 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-medium text-text-light">Platform Issues</p>
                <p className="text-xs text-text-muted mt-1">Connection problems or errors with publishing platforms</p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.platform_issues}
                onChange={(e) => setNotificationPrefs(prev => ({ ...prev, platform_issues: e.target.checked }))}
                className="w-5 h-5 accent-accent-cyan"
              />
            </label>

            {/* Billing Alerts */}
            <label className="flex items-center justify-between p-4 bg-card-bg/10 border border-white/10 rounded-lg hover:border-accent-cyan/30 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-medium text-text-light">Billing Alerts</p>
                <p className="text-xs text-text-muted mt-1">Quota warnings and billing-related notifications</p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.billing_alerts}
                onChange={(e) => setNotificationPrefs(prev => ({ ...prev, billing_alerts: e.target.checked }))}
                className="w-5 h-5 accent-accent-cyan"
              />
            </label>

            {/* Master Toggle */}
            <label className="flex items-center justify-between p-4 bg-accent-orange/10 border border-accent-orange/30 rounded-lg hover:border-accent-orange/50 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-medium text-accent-orange">All Push Notifications</p>
                <p className="text-xs text-text-muted mt-1">Master toggle for all push notifications</p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.push_notifications}
                onChange={(e) => setNotificationPrefs(prev => ({ ...prev, push_notifications: e.target.checked }))}
                className="w-5 h-5 accent-accent-orange"
              />
            </label>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleUpdatePreferences}
              disabled={isLoading}
              className="px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-accent-cyan">About Notifications</p>
              <p className="text-sm text-text-muted mt-1">
                Push notifications help you stay updated on your content creation activities. You can customize which notifications you receive and disable them anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BillingTab = () => (
    <div className="space-y-6">
      <div className="glass rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-text-light mb-6">Current Plan</h3>

        <div className="bg-accent-green/20 border border-accent-green/30 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-text-light">{billing.currentPlan || 'Free'} Plan</h4>
              <p className="text-sm text-text-muted">
                {billing.nextBillingDate
                  ? `Next billing: ${new Date(billing.nextBillingDate).toLocaleDateString()}`
                  : 'No billing date'}
              </p>
            </div>
            <Zap className="w-12 h-12 text-accent-green" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-muted mb-1">Monthly Quota</p>
              <p className="text-lg font-bold text-text-light">
                {billing.monthlyQuota?.toLocaleString() || '0'} units
              </p>
            </div>
            <div>
              <p className="text-sm text-text-muted mb-1">Used This Month</p>
              <p className="text-lg font-bold text-accent-cyan">
                {billingUsage.used?.toLocaleString() || '0'} units
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-muted">Usage</span>
              <span className="text-text-muted">{billingUsage.percentage?.toFixed(1) || '0.0'}%</span>
            </div>
            <div className="w-full bg-card-bg/50 rounded-full h-2">
              <div
                className="h-2 bg-accent-cyan rounded-full transition-all"
                style={{ width: `${Math.min(billingUsage.percentage || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Usage Breakdown */}
        <div className="bg-card-bg/20 border border-white/10 rounded-lg p-6 mb-6">
          <h4 className="text-md font-bold text-text-light mb-4">Usage Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-accent-cyan/10 rounded-lg">
              <p className="text-2xl font-bold text-accent-cyan">
                {billingUsage.breakdown?.workflows || 0}
              </p>
              <p className="text-sm text-text-muted mt-1">Workflows</p>
              <p className="text-xs text-text-muted">×5 units each</p>
            </div>
            <div className="text-center p-4 bg-accent-green/10 rounded-lg">
              <p className="text-2xl font-bold text-accent-green">
                {billingUsage.breakdown?.content_pieces || 0}
              </p>
              <p className="text-sm text-text-muted mt-1">Content Pieces</p>
              <p className="text-xs text-text-muted">×2 units each</p>
            </div>
            <div className="text-center p-4 bg-accent-orange/10 rounded-lg">
              <p className="text-2xl font-bold text-accent-orange">
                {billingUsage.breakdown?.publications || 0}
              </p>
              <p className="text-sm text-text-muted mt-1">Publications</p>
              <p className="text-xs text-text-muted">×1 unit each</p>
            </div>
          </div>
          {billingUsage.resetDate && (
            <p className="text-sm text-text-muted mt-4 text-center">
              Usage resets on {new Date(billingUsage.resetDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-card-bg/20 border border-white/10 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-bold text-text-light">Payment Method</h4>
            <CreditCard className="w-5 h-5 text-text-muted" />
          </div>
          <p className="text-text-light mb-4">{billing.paymentMethod || 'No payment method'}</p>
          <button className="px-4 py-2 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-colors">
            Update Payment Method
          </button>
        </div>
      </div>

      {/* Available Plans */}
      <div className="glass rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-text-light mb-6">Available Plans</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Free',
              quota: 10000,
              price: '$0',
              features: ['10,000 units/month', '~2,000 workflows', '~5,000 content pieces', 'Basic support'],
              current: billing.currentPlan === 'Free'
            },
            {
              name: 'Pro',
              quota: 50000,
              price: '$29',
              features: ['50,000 units/month', '~10,000 workflows', '~25,000 content pieces', 'Priority support', 'Advanced analytics'],
              current: billing.currentPlan === 'Pro',
              popular: true
            },
            {
              name: 'Enterprise',
              quota: 100000,
              price: '$99',
              features: ['100,000 units/month', '~20,000 workflows', '~50,000 content pieces', '24/7 support', 'Custom integrations'],
              current: billing.currentPlan === 'Enterprise'
            }
          ].map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-xl border transition-all ${plan.current
                ? 'bg-accent-green/10 border-accent-green/50'
                : 'bg-card-bg/20 border-white/10 hover:border-accent-cyan/50'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-3 py-1 bg-accent-orange text-white text-xs font-bold rounded-full">
                    POPULAR
                  </span>
                </div>
              )}
              <h4 className="text-xl font-bold text-text-light mb-2">{plan.name}</h4>
              <p className="text-3xl font-bold text-accent-cyan mb-4">
                {plan.price}<span className="text-sm text-text-muted">/month</span>
              </p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  if (!plan.current) {
                    toast.info('Plan upgrades coming soon! Stay tuned for updates.');
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${plan.current
                    ? 'bg-card-bg/50 text-text-muted cursor-not-allowed'
                    : 'bg-accent-orange/50 text-white cursor-not-allowed relative group'
                  }`}
                disabled={true}
              >
                <span className="flex items-center justify-center gap-2">
                  {plan.current ? (
                    'Current Plan'
                  ) : (
                    <>
                      <span>Upgrade</span>
                      <span className="text-xs bg-accent-cyan/20 px-2 py-0.5 rounded-full">
                        Coming Soon
                      </span>
                    </>
                  )}
                </span>
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
    preferences: (
      <div className="space-y-6">
        <div className="glass rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-text-light mb-2">Content Preferences</h3>
          <p className="text-sm text-text-muted mb-6">Set your default preferences for content creation</p>

          {/* Default Content Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-light mb-2">Default Content Type</label>
            <select
              value={contentPreferences.defaultContentType}
              onChange={(e) => setContentPreferences(prev => ({ ...prev, defaultContentType: e.target.value }))}
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            >
              <option value="blog-post">Blog Post</option>
              <option value="article">Article</option>
              <option value="social-media">Social Media</option>
              <option value="newsletter">Newsletter</option>
              <option value="product-description">Product Description</option>
              <option value="press-release">Press Release</option>
            </select>
          </div>

          {/* Default Tone */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-light mb-2">Default Tone</label>
            <select
              value={contentPreferences.defaultTone}
              onChange={(e) => setContentPreferences(prev => ({ ...prev, defaultTone: e.target.value }))}
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="conversational">Conversational</option>
              <option value="authoritative">Authoritative</option>
              <option value="humorous">Humorous</option>
            </select>
          </div>

          {/* Default Platforms */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-light mb-2">Default Publishing Platforms</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['wordpress', 'medium', 'linkedin', 'twitter', 'facebook', 'instagram'].map((platform) => (
                <label key={platform} className="flex items-center gap-2 p-3 bg-card-bg/20 border border-white/20 rounded-lg hover:border-accent-cyan/50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contentPreferences.defaultPlatforms.includes(platform)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setContentPreferences(prev => ({
                          ...prev,
                          defaultPlatforms: [...prev.defaultPlatforms, platform]
                        }));
                      } else {
                        setContentPreferences(prev => ({
                          ...prev,
                          defaultPlatforms: prev.defaultPlatforms.filter(p => p !== platform)
                        }));
                      }
                    }}
                    className="w-4 h-4 accent-accent-cyan"
                  />
                  <span className="text-sm text-text-light capitalize">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Default Word Count */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-light mb-2">
              Default Word Count: {contentPreferences.defaultWordCount}
            </label>
            <input
              type="range"
              min="300"
              max="3000"
              step="100"
              value={contentPreferences.defaultWordCount}
              onChange={(e) => setContentPreferences(prev => ({ ...prev, defaultWordCount: parseInt(e.target.value) }))}
              className="w-full h-2 bg-card-bg/50 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>300</span>
              <span>1,500</span>
              <span>3,000</span>
            </div>
          </div>

          {/* Research Depth */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-light mb-2">Research Depth</label>
            <div className="grid grid-cols-3 gap-3">
              {['basic', 'standard', 'deep'].map((depth) => (
                <button
                  key={depth}
                  onClick={() => setContentPreferences(prev => ({ ...prev, researchDepth: depth }))}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${contentPreferences.researchDepth === depth
                    ? 'bg-accent-cyan text-dark-bg'
                    : 'bg-card-bg/20 border border-white/20 text-text-light hover:border-accent-cyan/50'
                    }`}
                >
                  {depth.charAt(0).toUpperCase() + depth.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Image Settings */}
          <div className="mb-6">
            <label className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-text-light">Include Images</p>
                <p className="text-xs text-text-muted">Automatically generate images for content</p>
              </div>
              <input
                type="checkbox"
                checked={contentPreferences.includeImages}
                onChange={(e) => setContentPreferences(prev => ({ ...prev, includeImages: e.target.checked }))}
                className="w-4 h-4 accent-accent-cyan"
              />
            </label>

            {contentPreferences.includeImages && (
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Number of Images: {contentPreferences.defaultImages}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={contentPreferences.defaultImages}
                  onChange={(e) => setContentPreferences(prev => ({ ...prev, defaultImages: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-card-bg/50 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-accent-cyan">Default Settings</p>
                <p className="text-sm text-text-muted mt-1">
                  These preferences will be used as defaults when creating new content. You can override them for individual content pieces.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handlePreferencesUpdate}
              disabled={isLoading}
              className="px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    ),
    brand: (
      <div className="space-y-6">
        <div className="glass rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-bold text-text-light mb-2">Brand Voice</h3>
          <p className="text-sm text-text-muted mb-6">Define your brand's tone and style for AI-generated content</p>

          {/* Brand Guidelines */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-light mb-2">
              Brand Guidelines
              <span className="text-text-muted ml-2 font-normal">(Overall description)</span>
            </label>
            <textarea
              value={brandVoice.brand_guidelines}
              onChange={(e) => setBrandVoice(prev => ({ ...prev, brand_guidelines: e.target.value }))}
              placeholder="Describe your brand's voice, values, and messaging style..."
              rows={4}
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all resize-none"
            />
          </div>

          {/* Tone Descriptors */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-light mb-2">
              Tone Descriptors
              <span className="text-text-muted ml-2 font-normal">(e.g., professional, friendly)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="tone-descriptor-input"
                type="text"
                placeholder="Add a tone descriptor..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    const value = e.target.value.trim();

                    setBrandVoice(prev => ({
                      ...prev,
                      tone_descriptors: [...prev.tone_descriptors, value]
                    }));
                    e.target.value = '';
                  }
                }}
                className="flex-1 px-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('tone-descriptor-input');
                  const value = input.value.trim();
                  if (value) {

                    setBrandVoice(prev => ({
                      ...prev,
                      tone_descriptors: [...prev.tone_descriptors, value]
                    }));
                    input.value = '';
                  }
                }}
                className="px-4 py-2 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {brandVoice.tone_descriptors && brandVoice.tone_descriptors.length > 0 ? (
                brandVoice.tone_descriptors.map((tone, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-accent-cyan/20 border border-accent-cyan/30 rounded-full text-sm flex items-center gap-2"
                  >
                    <span className="text-white font-medium" style={{ color: '#ffffff' }}>{tone}</span>
                    <button
                      onClick={() => setBrandVoice(prev => ({
                        ...prev,
                        tone_descriptors: prev.tone_descriptors.filter((_, i) => i !== index)
                      }))}
                      className="text-white hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-sm text-text-muted italic">No tone descriptors added yet</p>
              )}
            </div>
          </div>

          {/* Do's */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-light mb-2">
              Do's
              <span className="text-text-muted ml-2 font-normal">(Things to include)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="dos-input"
                type="text"
                placeholder="Add a guideline..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    const value = e.target.value.trim();
                    setBrandVoice(prev => ({
                      ...prev,
                      do: [...prev.do, value]
                    }));
                    e.target.value = '';
                  }
                }}
                className="flex-1 px-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('dos-input');
                  const value = input.value.trim();
                  if (value) {
                    setBrandVoice(prev => ({
                      ...prev,
                      do: [...prev.do, value]
                    }));
                    input.value = '';
                  }
                }}
                className="px-4 py-2 bg-accent-green hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {brandVoice.do.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg group hover:bg-green-500/15 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="flex-1 text-sm text-white">{item}</span>
                  <button
                    onClick={() => setBrandVoice(prev => ({
                      ...prev,
                      do: prev.do.filter((_, i) => i !== index)
                    }))}
                    className="text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Don'ts */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-light mb-2">
              Don'ts
              <span className="text-text-muted ml-2 font-normal">(Things to avoid)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="donts-input"
                type="text"
                placeholder="Add a guideline..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    const value = e.target.value.trim();
                    setBrandVoice(prev => ({
                      ...prev,
                      dont: [...prev.dont, value]
                    }));
                    e.target.value = '';
                  }
                }}
                className="flex-1 px-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('donts-input');
                  const value = input.value.trim();
                  if (value) {
                    setBrandVoice(prev => ({
                      ...prev,
                      dont: [...prev.dont, value]
                    }));
                    input.value = '';
                  }
                }}
                className="px-4 py-2 bg-red-500 hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {brandVoice.dont.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg group hover:bg-red-500/15 transition-colors"
                >
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="flex-1 text-sm text-white">{item}</span>
                  <button
                    onClick={() => setBrandVoice(prev => ({
                      ...prev,
                      dont: prev.dont.filter((_, i) => i !== index)
                    }))}
                    className="text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Palette className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-accent-cyan">AI Content Generation</p>
                <p className="text-sm text-text-muted mt-1">
                  Your brand voice settings will be automatically applied to all AI-generated content to maintain consistency.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleBrandVoiceUpdate}
              disabled={isLoading}
              className="px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Brand Voice'}
            </button>
          </div>
        </div>
      </div>
    ),
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                      ? 'bg-accent-orange/20 text-accent-orange'
                      : 'text-text-light hover:text-accent-cyan hover:bg-card-bg/20'
                      }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                    <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeTab === tab.id ? 'rotate-90' : ''
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