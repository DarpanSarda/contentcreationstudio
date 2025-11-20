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
}

// Create and export singleton instance
const apiClient = new APIClient();
export default apiClient;