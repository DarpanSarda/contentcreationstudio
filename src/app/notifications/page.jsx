// app/notifications/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useToast } from '@/contexts/ToastContext';
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Filter,
    Loader2,
    AlertCircle,
    FileText,
    Zap,
    Activity,
    AlertTriangle,
    CreditCard,
    X
} from 'lucide-react';

export default function NotificationsPage() {
    const {
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
    } = useNotifications();

    const toast = useToast();
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [selectedNotification, setSelectedNotification] = useState(null);

    // Filter notifications
    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.is_read;
        if (filter === 'read') return notification.is_read;
        return true;
    });

    // Handle notification click
    const handleNotificationClick = async (notification) => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
        }

        // Navigate to URL if provided
        if (notification.url) {
            window.location.href = notification.url;
        }
    };

    // Handle delete
    const handleDelete = async (e, notificationId) => {
        e.stopPropagation();

        if (confirm('Are you sure you want to delete this notification?')) {
            const success = await deleteNotification(notificationId);
            if (success) {
                toast.success('Notification deleted');
            } else {
                toast.error('Failed to delete notification');
            }
        }
    };

    // Handle mark all as read
    const handleMarkAllAsRead = async () => {
        const success = await markAllAsRead();
        if (success) {
            toast.success('All notifications marked as read');
        } else {
            toast.error('Failed to mark all as read');
        }
    };

    // Get icon for notification type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'content_published':
                return <FileText className="w-5 h-5 text-accent-green" />;
            case 'workflow_completed':
                return <CheckCheck className="w-5 h-5 text-accent-cyan" />;
            case 'workflow_failed':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'agent_updates':
                return <Activity className="w-5 h-5 text-accent-purple" />;
            case 'platform_issues':
                return <AlertTriangle className="w-5 h-5 text-accent-orange" />;
            case 'billing_alerts':
                return <CreditCard className="w-5 h-5 text-accent-yellow" />;
            default:
                return <Bell className="w-5 h-5 text-text-muted" />;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Header */}
            <div className="bg-dark-bg border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-text-light">Notifications</h1>
                                <p className="text-text-muted mt-1">
                                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                                </p>
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="px-4 py-2 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-all hover:scale-105 flex items-center gap-2"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="flex items-center gap-2 mb-6">
                    <Filter className="w-4 h-4 text-text-muted" />
                    <div className="flex gap-2">
                        {['all', 'unread', 'read'].map((filterOption) => (
                            <button
                                key={filterOption}
                                onClick={() => setFilter(filterOption)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === filterOption
                                        ? 'bg-accent-orange text-white'
                                        : 'bg-card-bg/20 text-text-light hover:bg-card-bg/30'
                                    }`}
                            >
                                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                                {filterOption === 'unread' && unreadCount > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="glass rounded-xl border border-white/10 p-12 text-center">
                        <Bell className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-text-light mb-2">
                            {filter === 'unread' ? 'No unread notifications' : filter === 'read' ? 'No read notifications' : 'No notifications yet'}
                        </h3>
                        <p className="text-text-muted">
                            {filter === 'all'
                                ? "You'll see notifications here when there's activity on your account"
                                : `Switch to "${filter === 'unread' ? 'all' : 'unread'}" to see other notifications`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`glass rounded-xl border transition-all cursor-pointer group ${notification.is_read
                                        ? 'border-white/10 hover:border-white/20'
                                        : 'border-accent-cyan/30 bg-accent-cyan/5 hover:border-accent-cyan/50'
                                    }`}
                            >
                                <div className="p-4">
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${notification.is_read ? 'bg-card-bg/20' : 'bg-accent-cyan/10'
                                            }`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className={`font-medium mb-1 ${notification.is_read ? 'text-text-light' : 'text-text-light font-semibold'
                                                        }`}>
                                                        {notification.title}
                                                    </h3>
                                                    <p className="text-sm text-text-muted line-clamp-2">
                                                        {notification.body}
                                                    </p>
                                                    <p className="text-xs text-text-muted mt-2">
                                                        {formatDate(notification.created_at)}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notification.is_read && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(notification.id);
                                                            }}
                                                            className="p-2 hover:bg-accent-cyan/20 rounded-lg transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-4 h-4 text-accent-cyan" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => handleDelete(e, notification.id)}
                                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Unread indicator */}
                                        {!notification.is_read && (
                                            <div className="flex-shrink-0 w-2 h-2 bg-accent-cyan rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Banner */}
                {filteredNotifications.length > 0 && (
                    <div className="mt-8 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Bell className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-accent-cyan">Notification Settings</p>
                                <p className="text-sm text-text-muted mt-1">
                                    Manage your notification preferences in{' '}
                                    <a href="/settings?tab=notifications" className="text-accent-cyan hover:underline">
                                        Settings → Notifications
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
