// src/contexts/NotificationContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import websocketNotificationService from '@/services/websocketNotificationService';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.getNotifications();
            if (response && response.success) {
                setNotifications(response.notifications || []);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch unread count
    const fetchUnreadCount = async () => {
        try {
            const response = await apiClient.getUnreadNotificationCount();
            if (response && response.success) {
                setUnreadCount(response.unread_count || 0);
            }
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    // Mark as read
    const markAsRead = async (notificationId) => {
        try {
            await apiClient.markNotificationAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            return true;
        } catch (error) {
            console.error('Failed to mark as read:', error);
            return false;
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await apiClient.markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
            setUnreadCount(0);
            return true;
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            return false;
        }
    };

    // Delete notification
    const deleteNotification = async (notificationId) => {
        try {
            await apiClient.deleteNotification(notificationId);
            const notification = notifications.find(n => n.id === notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));

            // Update unread count if deleted notification was unread
            if (notification && !notification.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            return true;
        } catch (error) {
            console.error('Failed to delete notification:', error);
            return false;
        }
    };

    // Add new notification (from FCM or manual)
    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        if (!notification.is_read) {
            setUnreadCount(prev => prev + 1);
        }
    };

    // Request browser notification permission
    const requestNotificationPermission = async () => {
        return await websocketNotificationService.requestPermission();
    };

    // Get notification permission status
    const getNotificationPermissionStatus = () => {
        return websocketNotificationService.getPermissionStatus();
    };

    // Initialize WebSocket connection
    useEffect(() => {
        // Get token from localStorage (using correct key from auth system)
        const token = localStorage.getItem('access_token');

        if (!token) {
            console.warn('No auth token found, skipping WebSocket connection');
            return;
        }

        // Check if already connected (prevents double connection in React Strict Mode)
        if (websocketNotificationService.isWebSocketConnected()) {
            return;
        }

        // Connect to WebSocket
        websocketNotificationService.connect(token);
        setIsWebSocketConnected(true);

        // Register message handler
        const unsubscribe = websocketNotificationService.onMessage((notification) => {
            addNotification(notification);
        });

        // Request browser notification permission
        websocketNotificationService.requestPermission();

        // Cleanup on unmount (only disconnect if actually unmounting, not on Strict Mode double-mount)
        return () => {
            // Only unsubscribe the message handler, don't disconnect WebSocket
            // This prevents disconnection during React Strict Mode double-mount
            unsubscribe();
        };
    }, []); // Only run once on mount

    // Fetch initial data
    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                isLoading,
                isWebSocketConnected,
                fetchNotifications,
                fetchUnreadCount,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                addNotification,
                requestNotificationPermission,
                getNotificationPermissionStatus
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
}
