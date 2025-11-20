// src/contexts/AuthContext.jsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../lib/api';
import { useToast } from './ToastContext';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toastInstance = useToast();

  // Set toast instance in API client when provider mounts
  useEffect(() => {
    if (apiClient && toastInstance) {
      apiClient.setToast(toastInstance);
    }
  }, [toastInstance]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = apiClient.getToken();
        const userData = apiClient.getUser();

        if (token && userData) {
          setUser(userData);
          setIsAuthenticated(true);
          // Set token in api client
          apiClient.setToken(token);
        } else {
          // Clear invalid data
          apiClient.clearAuthData();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        apiClient.clearAuthData();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    const toastId = toastInstance.loading('Signing in...');

    try {
      const response = await apiClient.login(email, password);

      // Validate response structure
      if (!response || !response.user) {
        throw new Error('Invalid login response from server');
      }

      toastInstance.dismiss(toastId);
      toastInstance.success(`Welcome back, ${response.user.username}!`);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      toastInstance.dismiss(toastId);
      toastInstance.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  // Register function
  const register = async (email, password, username) => {
    const toastId = toastInstance.loading('Creating your account...');

    try {
      const response = await apiClient.register(email, password, username);

      // Validate response structure
      if (!response || !response.user) {
        throw new Error('Invalid registration response from server');
      }

      toastInstance.dismiss(toastId);
      toastInstance.success(`Account created successfully! Welcome, ${response.user.username}!`);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      toastInstance.dismiss(toastId);
      toastInstance.error(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiClient.logout();
      toastInstance.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    apiClient.setUser(userData);
  };

  // Refresh user data
  const refreshUser = () => {
    const userData = apiClient.getUser();
    if (userData) {
      setUser(userData);
      return userData;
    }
    return null;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};