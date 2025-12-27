// lib/api.js
import { AuthUtils } from './authUtils';

class APIClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    this.token = null;
    this.toast = null;
  }

  // Set toast instance
  setToast(toastInstance) {
    this.toast = toastInstance;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
    }
  }

  // Get stored token
  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  // Get refresh token
  getRefreshToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  // Set refresh token
  setRefreshToken(token) {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('refresh_token', token);
      } else {
        localStorage.removeItem('refresh_token');
      }
    }
  }

  // Get stored user data
  getUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // Set user data
  setUser(userData) {
    if (typeof window !== 'undefined') {
      if (userData) {
        localStorage.setItem('user_data', JSON.stringify(userData));
      } else {
        localStorage.removeItem('user_data');
      }
    }
  }

  // Clear all stored data
  clearAuthData() {
    this.setToken(null);
    this.setRefreshToken(null);
    this.setUser(null);
  }

  // Make API request with authentication
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      // Handle token refresh if unauthorized
      if (response.status === 401 && endpoint !== '/auth/refresh-token') {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          config.headers.Authorization = `Bearer ${this.getToken()}`;
          const retryResponse = await fetch(url, config);
          return this.handleResponse(retryResponse);
        }
      }

      return this.handleResponse(response);
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Handle API response
  async handleResponse(response) {
    let data;

    try {
      data = await response.json();
    } catch (jsonError) {
      // Handle cases where response is not valid JSON
      const text = await response.text();
      data = { detail: text || 'Unable to parse server response' };
    }

    if (!response.ok) {
      // Create a proper error object
      const errorMessage = this.extractErrorMessage(data);
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      error.statusText = response.statusText;
      throw error;
    }

    return data;
  }

  // Extract error message from different response formats
  extractErrorMessage(data) {
    if (typeof data === 'string') {
      return data;
    }

    if (data && typeof data === 'object') {
      // FastAPI validation error format
      if (data.detail) {
        if (Array.isArray(data.detail)) {
          return data.detail.map(err =>
            typeof err === 'object' && err.msg ? err.msg :
              typeof err === 'object' && err.message ? err.message :
                typeof err === 'string' ? err : 'Validation error'
          ).join(', ');
        }
        if (typeof data.detail === 'object' && data.detail.msg) {
          return data.detail.msg;
        }
        if (typeof data.detail === 'object' && data.detail.message) {
          return data.detail.message;
        }
        return String(data.detail);
      }

      // Common error formats
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.msg) return data.msg;
    }

    return 'API request failed';
  }

  // Refresh access token
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearAuthData();
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.access_token);
        return true;
      } else {
        // Refresh token is invalid, clear auth data
        this.clearAuthData();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuthData();
      return false;
    }
  }

  // Authentication endpoints
  async login(email, password) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Store tokens and user data
      this.setToken(response.access_token);
      this.setRefreshToken(response.refresh_token);
      this.setUser(response.user);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(email, password, username) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, username }),
      });

      // Store tokens and user data
      this.setToken(response.access_token);
      this.setRefreshToken(response.refresh_token);
      this.setUser(response.user);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async requestPasswordReset(email) {
    try {
      // This would typically send a reset email
      // For now, we'll simulate success
      const response = { message: 'Password reset email sent successfully' };
      if (this.toast?.success) {
        this.toast.success('Password reset email sent! Please check your inbox.');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Failed to send password reset email. Please try again.');
      }
      throw error;
    }
  }

  async resetPassword(email, newPassword) {
    try {
      const response = await this.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, new_password: newPassword }),
      });

      if (this.toast?.success) {
        this.toast.success('Password reset successfully! You can now log in with your new password.');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Failed to reset password. Please try again.');
      }
      throw error;
    }
  }

  async logout() {
    try {
      const token = this.getToken();
      if (token) {
        await this.request('/auth/logout', {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Get current user info
  getCurrentUser() {
    return this.getUser();
  }

  // Profile management endpoints
  async getUserProfile() {
    try {
      const response = await this.request('/user/profile', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(profileData) {
    try {
      const response = await this.request('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (this.toast?.success) {
        this.toast.success('Profile updated successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Failed to update profile. Please try again.');
      }
      throw error;
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      const response = await this.request('/user/change-password', {
        method: 'POST',
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (this.toast?.success) {
        this.toast.success('Password changed successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        const errorMessage = error.message || 'Failed to change password';
        this.toast.error(errorMessage);
      }
      throw error;
    }
  }

  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload to public folder
      const fileName = `profile_${Date.now()}_${file.name}`;
      const publicPath = `/uploads/profiles/${fileName}`;

      // For now, we'll handle this client-side by copying to public folder
      // In production, you'd upload to a server or cloud storage
      return publicPath;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Failed to upload profile picture');
      }
      throw error;
    }
  }

  // Content management endpoints
  async createContent(contentData) {
    try {
      const response = await this.request('/content/', {
        method: 'POST',
        body: JSON.stringify(contentData),
      });

      if (this.toast?.success) {
        this.toast.success('Content created successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Failed to create content');
      }
      throw error;
    }
  }

  async getContentById(contentId) {
    try {
      const response = await this.request(`/content/${contentId}`, {
        method: 'GET',
      });
      return response.content;
    } catch (error) {
      throw error;
    }
  }

  async getAllContent(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);
      if (params.status) queryParams.append('status', params.status);
      if (params.content_type) queryParams.append('content_type', params.content_type);
      if (params.my_content) queryParams.append('my_content', 'true');

      const response = await this.request(`/content/?${queryParams.toString()}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getMyContent(limit = 50, offset = 0) {
    try {
      const response = await this.request(`/content/user/my-content?limit=${limit}&offset=${offset}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateContent(contentId, updateData) {
    try {
      const response = await this.request(`/content/${contentId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (this.toast?.success) {
        this.toast.success('Content updated successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Failed to update content');
      }
      throw error;
    }
  }

  async deleteContent(contentId) {
    try {
      const response = await this.request(`/content/${contentId}`, {
        method: 'DELETE',
      });

      if (this.toast?.success) {
        this.toast.success('Content deleted successfully');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Failed to delete content');
      }
      throw error;
    }
  }

  async searchContent(query, myContent = false, limit = 50) {
    try {
      const params = new URLSearchParams({
        q: query,
        my_content: myContent.toString(),
        limit: limit.toString(),
      });

      const response = await this.request(`/content/search/?${params.toString()}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getContentStats() {
    try {
      const response = await this.request('/content/stats/overview', {
        method: 'GET',
      });
      return response.stats;
    } catch (error) {
      throw error;
    }
  }

  async duplicateContent(contentId) {
    try {
      const response = await this.request(`/content/${contentId}/duplicate`, {
        method: 'POST',
      });

      if (this.toast?.success) {
        this.toast.success('Content duplicated successfully');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Failed to duplicate content');
      }
      throw error;
    }
  }

  async approveContent(contentId) {
    try {
      const response = await this.request(`/content/${contentId}/approve`, {
        method: 'POST',
      });

      if (this.toast?.success) {
        this.toast.success('Content approved and published!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Failed to approve content');
      }
      throw error;
    }
  }

  // Agent endpoints - Research
  async startResearch(topic, depth = 'advanced') {
    try {
      const response = await this.request('/agent/research', {
        method: 'POST',
        body: JSON.stringify({ topic, depth }),
      });

      if (this.toast?.success) {
        this.toast.success('Research completed successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Research failed');
      }
      throw error;
    }
  }

  async getResearchById(researchId) {
    try {
      const response = await this.request(`/agent/research/${researchId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async listResearch(limit = 20, offset = 0) {
    try {
      const response = await this.request(`/agent/research?limit=${limit}&offset=${offset}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteResearch(researchId) {
    try {
      const response = await this.request(`/agent/research/${researchId}`, {
        method: 'DELETE',
      });

      if (this.toast?.success) {
        this.toast.success('Research deleted successfully');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Failed to delete research');
      }
      throw error;
    }
  }

  // Agent endpoints - Writing
  async generateContent(data) {
    try {
      const response = await this.request('/agent/write', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (this.toast?.success) {
        this.toast.success('Content generated successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Content generation failed');
      }
      throw error;
    }
  }

  async getGeneratedContent(contentId) {
    try {
      const response = await this.request(`/agent/write/${contentId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Agent endpoints - Image Generation
  async generateImage(data) {
    try {
      const response = await this.request('/agent/generate-image', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (this.toast?.success) {
        this.toast.success('Images generated successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Image generation failed');
      }
      throw error;
    }
  }

  async getGeneratedImage(imageId) {
    try {
      const response = await this.request(`/agent/generate-image/${imageId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async listGeneratedImages(limit = 20, offset = 0) {
    try {
      const response = await this.request(`/agent/generate-image?limit=${limit}&offset=${offset}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteGeneratedImage(imageId) {
    try {
      const response = await this.request(`/agent/generate-image/${imageId}`, {
        method: 'DELETE',
      });

      if (this.toast?.success) {
        this.toast.success('Image deleted successfully');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error('Failed to delete image');
      }
      throw error;
    }
  }

  async getImageStyles() {
    try {
      const response = await this.request('/agent/styles', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Agent status
  async getAgentStatus() {
    try {
      const response = await this.request('/agent/status', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ==================== Workflow APIs ====================

  async startWorkflow(data) {
    try {
      const response = await this.request('/workflow/start', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (this.toast?.success) {
        this.toast.success('Workflow started successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Failed to start workflow');
      }
      throw error;
    }
  }

  async getWorkflowStatus(workflowId) {
    try {
      const response = await this.request(`/workflow/${workflowId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getWorkflowHistory(status = null, limit = 20) {
    try {
      let url = `/workflow/?limit=${limit}`;
      if (status) {
        url += `&workflow_status=${status}`;
      }
      const response = await this.request(url, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async retryWorkflow(workflowId, stages = null) {
    try {
      const response = await this.request(`/workflow/${workflowId}/retry`, {
        method: 'POST',
        body: JSON.stringify({ stages }),
      });
      if (this.toast?.success) {
        this.toast.success('Workflow retry started!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Failed to retry workflow');
      }
      throw error;
    }
  }

  async cancelWorkflow(workflowId) {
    try {
      const response = await this.request(`/workflow/${workflowId}/cancel`, {
        method: 'DELETE',
      });
      if (this.toast?.success) {
        this.toast.success('Workflow cancellation requested');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Failed to cancel workflow');
      }
      throw error;
    }
  }

  // ==================== Publishing APIs ====================

  async publishContent(contentId, platforms, settings = null) {
    try {
      const response = await this.request('/publishing/publish', {
        method: 'POST',
        body: JSON.stringify({
          content_id: contentId,
          platforms,
          settings
        }),
      });
      if (this.toast?.success) {
        this.toast.success('Content published successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Failed to publish content');
      }
      throw error;
    }
  }

  async getPublishingHistory(contentId = null, limit = 20) {
    try {
      let url = `/publishing/history?limit=${limit}`;
      if (contentId) {
        url += `&content_id=${contentId}`;
      }
      const response = await this.request(url, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getSupportedPlatforms() {
    try {
      const response = await this.request('/publishing/platforms', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async savePlatformCredentials(platform, credentials, settings = null) {
    try {
      const response = await this.request('/publishing/credentials', {
        method: 'POST',
        body: JSON.stringify({
          platform,
          credentials,
          settings
        }),
      });
      if (this.toast?.success) {
        this.toast.success(`${platform} credentials saved successfully!`);
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Failed to save credentials');
      }
      throw error;
    }
  }

  async getUserPlatformCredentials() {
    try {
      const response = await this.request('/publishing/credentials', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deletePlatformCredentials(platform) {
    try {
      const response = await this.request(`/publishing/credentials/${platform}`, {
        method: 'DELETE',
      });
      if (this.toast?.success) {
        this.toast.success(`${platform} disconnected successfully`);
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Failed to delete credentials');
      }
      throw error;
    }
  }

  async testPlatformConnection(platform) {
    try {
      const response = await this.request(`/publishing/test/${platform}`, {
        method: 'POST',
      });
      if (this.toast?.success) {
        this.toast.success(`${platform} connection test successful!`);
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || `Failed to test ${platform} connection`);
      }
      throw error;
    }
  }

  async schedulePublication(contentId, platforms, scheduledTime, settings = null) {
    try {
      const response = await this.request('/publishing/schedule', {
        method: 'POST',
        body: JSON.stringify({
          content_id: contentId,
          platforms,
          scheduled_time: scheduledTime,
          settings
        }),
      });
      if (this.toast?.success) {
        this.toast.success('Publication scheduled successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Failed to schedule publication');
      }
      throw error;
    }
  }

  // ==================== Analytics APIs ====================

  async getAnalyticsOverview() {
    try {
      const response = await this.request('/analytics/overview', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getContentAnalytics(contentId) {
    try {
      const response = await this.request(`/analytics/content/${contentId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getPlatformAnalytics() {
    try {
      const response = await this.request('/analytics/platforms', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getWorkflowAnalytics(limit = 20) {
    try {
      const response = await this.request(`/analytics/workflows?limit=${limit}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getRecentActivity(limit = 10) {
    try {
      const response = await this.request(`/analytics/recent-activity?limit=${limit}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ==================== Settings APIs ====================

  async getUserSettings() {
    try {
      const response = await this.request('/settings/', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateUserSettings(settings) {
    try {
      console.log("Settings : ", settings)
      const response = await this.request('/settings/', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      if (this.toast?.success) {
        this.toast.success('Settings updated successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Failed to update settings');
      }
      throw error;
    }
  }

  async connectPlatform(platform, credentials, settings = null) {
    try {
      const response = await this.request('/publishing/credentials', {
        method: 'POST',
        body: JSON.stringify({
          platform,
          credentials,
          settings,
          ...credentials
        }),
      });
      if (this.toast?.success) {
        this.toast.success(`${platform} connected successfully!`);
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || `Failed to connect ${platform}`);
      }
      throw error;
    }
  }

  async getPlatformsStatus() {
    try {
      const response = await this.request('/publishing/platforms', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async disconnectPlatform(platform) {
    try {
      const response = await this.request(`/publishing/credentials/${platform}`, {
        method: 'DELETE',
      });
      if (this.toast?.success) {
        this.toast.success(`${platform} disconnected successfully`);
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || `Failed to disconnect ${platform}`);
      }
      throw error;
    }
  }

  async testPlatformCredentials(platform, credentials) {
    try {
      const response = await this.request('/settings/api-keys/test', {
        method: 'POST',
        body: JSON.stringify({
          platform,
          credentials,
          ...credentials
        }),
      });
      if (this.toast?.success) {
        this.toast.success('Connection test successful!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Connection test failed');
      }
      throw error;
    }
  }

  // ==================== Support APIs ====================

  async createSupportTicket(ticketData) {
    try {
      const response = await this.request('/support/ticket', {
        method: 'POST',
        body: JSON.stringify(ticketData),
      });
      if (this.toast?.success) {
        this.toast.success('Support ticket created successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Failed to create support ticket');
      }
      throw error;
    }
  }

  async getSupportTickets(statusFilter = null, limit = 20, offset = 0) {
    try {
      let url = `/support/tickets?limit=${limit}&offset=${offset}`;
      if (statusFilter) {
        url += `&status_filter=${statusFilter}`;
      }
      const response = await this.request(url, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getTicketDetails(ticketId) {
    try {
      const response = await this.request(`/support/tickets/${ticketId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateSupportTicket(ticketId, updateData) {
    try {
      const response = await this.request(`/support/tickets/${ticketId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      if (this.toast?.success) {
        this.toast.success('Ticket updated successfully!');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Failed to update ticket');
      }
      throw error;
    }
  }

  async deleteSupportTicket(ticketId) {
    try {
      const response = await this.request(`/support/tickets/${ticketId}`, {
        method: 'DELETE',
      });
      if (this.toast?.success) {
        this.toast.success('Ticket deleted successfully');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Failed to delete ticket');
      }
      throw error;
    }
  }

  // ==================== Research APIs ====================

  async getAllResearch(limit = 20, offset = 0) {
    try {
      const response = await this.request(`/research/?limit=${limit}&offset=${offset}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getResearchById(researchId) {
    try {
      const response = await this.request(`/research/${researchId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteResearch(researchId) {
    try {
      const response = await this.request(`/research/${researchId}`, {
        method: 'DELETE',
      });
      if (this.toast?.success) {
        this.toast.success('Research deleted successfully');
      }
      return response;
    } catch (error) {
      if (this.toast?.error) {
        this.toast.error(error.message || 'Failed to delete research');
      }
      throw error;
    }
  }

  async getResearchSources(researchId) {
    try {
      const response = await this.request(`/research/${researchId}/sources`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getRelatedResearch(researchId, limit = 5) {
    try {
      const response = await this.request(`/research/${researchId}/related?limit=${limit}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ==================== Agent Monitoring APIs ====================

  /**
   * Get active workflows with real-time status
   * @returns {Promise} Active workflows data
   */
  async getActiveWorkflows() {
    try {
      const response = await this.request('/workflow/active', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch active workflows:', error);
      throw error;
    }
  }

  /**
   * Get task logs with optional filters
   * @param {Object} filters - Filter options (agent, level, time_range, limit)
   * @returns {Promise} Task logs data
   */
  async getTaskLogs(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.agent && filters.agent !== 'all') params.append('agent', filters.agent);
      if (filters.level && filters.level !== 'all') params.append('level', filters.level);
      if (filters.timeRange) params.append('time_range', filters.timeRange);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await this.request(`/agent/logs?${params.toString()}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch task logs:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics for all agents
   * @returns {Promise} Performance metrics and statistics
   */
  async getPerformanceMetrics() {
    try {
      const response = await this.request('/agent/metrics', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
      throw error;
    }
  }

  // ==================== Time-Series Analytics ====================

  /**
   * Get time-series analytics data for charts
   * @param {string} metric - Metric type ('views' or 'engagement')
   * @param {number} days - Number of days to fetch (7, 30, 90)
   * @returns {Promise} Time-series data
   */
  async getTimeSeriesAnalytics(metric = 'views', days = 30) {
    try {
      const response = await this.request(`/analytics/time-series?metric=${metric}&days=${days}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Failed to fetch time-series analytics:', error);
      throw error;
    }
  }

  // ==================== Brand Voice ====================
  async getBrandVoice() {
    return this.request('/settings/brand-voice', {
      method: 'GET'
    });
  }

  async updateBrandVoice(data) {
    return this.request('/settings/brand-voice', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // ==================== API Keys ====================
  async getAPIKeys() {
    return this.request('/settings/api-keys', {
      method: 'GET'
    });
  }

  async updateAPIKeys(keys) {
    return this.request('/settings/api-keys', {
      method: 'PUT',
      body: JSON.stringify(keys)
    });
  }

  // ==================== Billing ====================
  async getBillingInfo() {
    return this.request('/billing/info', {
      method: 'GET'
    });
  }

  async getBillingUsage() {
    return this.request('/billing/usage', {
      method: 'GET'
    });
  }

  async updatePaymentMethod(paymentData) {
    return this.request('/billing/update-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  async upgradePlan(planName, monthlyQuota) {
    return this.request('/billing/upgrade-plan', {
      method: 'POST',
      body: JSON.stringify({
        plan_name: planName,
        monthly_quota: monthlyQuota
      })
    });
  }




  async sendTestNotification() {
    return this.request('/notifications/test', {
      method: 'POST'
    });
  }

  async getNotificationPreferences() {
    return this.request('/notifications/preferences', {
      method: 'GET'
    });
  }

  async updateNotificationPreferences(preferences) {
    return this.request('/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences })
    });
  }

  // ==================== Notification History ====================
  async getNotifications(isRead = null, limit = 50, offset = 0) {
    const params = new URLSearchParams();
    if (isRead !== null) params.append('is_read', isRead);
    params.append('limit', limit);
    params.append('offset', offset);

    return this.request(`/notifications?${params.toString()}`, {
      method: 'GET'
    });
  }

  async getUnreadNotificationCount() {
    return this.request('/notifications/unread-count', {
      method: 'GET'
    });
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/mark-all-read', {
      method: 'PUT'
    });
  }

  async deleteNotification(notificationId) {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE'
    });
  }

  // ==================== BYOK Pricing & Subscriptions ====================

  // BYOK Status & Pricing
  async getBYOKStatus() {
    return this.request('/byok/status', {
      method: 'GET'
    });
  }

  async calculateBYOKPricing(planId, billingCycle = 'monthly') {
    return this.request('/byok/calculate', {
      method: 'POST',
      body: JSON.stringify({
        plan_id: planId,
        billing_cycle: billingCycle
      })
    });
  }

  // Billing & Invoices
  async getInvoices(limit = 10, offset = 0) {
    const params = new URLSearchParams();
    params.append('limit', limit);
    params.append('offset', offset);

    return this.request(`/billing/invoices?${params.toString()}`, {
      method: 'GET'
    });
  }

  async getUpcomingInvoice() {
    return this.request('/billing/upcoming', {
      method: 'GET'
    });
  }

  async updatePaymentMethod(paymentMethodId, setAsDefault = true, cardDetails = {}) {
    return this.request('/billing/payment-method', {
      method: 'POST',
      body: JSON.stringify({
        payment_method_id: paymentMethodId,
        set_as_default: setAsDefault,
        ...cardDetails
      })
    });
  }

  // Usage Tracking
  async getCurrentUsage() {
    return this.request('/usage/current', {
      method: 'GET'
    });
  }

  async trackUsage(contentPieces = 0, apiCalls = {}) {
    return this.request('/usage/track', {
      method: 'POST',
      body: JSON.stringify({
        content_pieces: contentPieces,
        api_calls: apiCalls
      })
    });
  }
}

// Create and export singleton instance
const apiClient = new APIClient();
export default apiClient;
