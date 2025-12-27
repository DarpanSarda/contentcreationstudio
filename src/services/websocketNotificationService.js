// src/services/websocketNotificationService.js
class WebSocketNotificationService {
    constructor() {
        this.ws = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.messageHandlers = [];
        this.keepAliveInterval = null;
    }

    /**
     * Connect to WebSocket notifications
     */
    connect(token) {
        if (this.ws && this.isConnected) {
            console.log('Already connected to WebSocket');
            return;
        }

        const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/ws/notifications?token=${token}`;

        try {
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('✅ WebSocket notifications connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.startKeepAlive();
            };

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.isConnected = false;
                this.stopKeepAlive();
                this.attemptReconnect(token);
            };
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
        }
    }

    /**
     * Handle incoming WebSocket message
     */
    handleMessage(message) {
        if (message.type === 'connected') {
            console.log('WebSocket connection confirmed:', message.message);
            return;
        }

        if (message.type === 'notification') {
            // Notify all registered handlers
            this.messageHandlers.forEach(handler => {
                try {
                    handler(message.data);
                } catch (error) {
                    console.error('Error in message handler:', error);
                }
            });

            // Show browser notification if permission granted
            this.showBrowserNotification(message.data);
        }
    }

    /**
     * Show browser notification
     */
    showBrowserNotification(notification) {
        if (!('Notification' in window)) {
            return;
        }

        if (Notification.permission === 'granted') {
            const notif = new Notification(notification.title, {
                body: notification.body,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: notification.type,
                data: notification,
                requireInteraction: false
            });

            // Handle notification click
            notif.onclick = () => {
                window.focus();
                if (notification.url) {
                    window.location.href = notification.url;
                }
                notif.close();
            };
        }
    }

    /**
     * Register message handler
     */
    onMessage(handler) {
        this.messageHandlers.push(handler);

        // Return unsubscribe function
        return () => {
            this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
        };
    }

    /**
     * Start keep-alive ping
     */
    startKeepAlive() {
        this.keepAliveInterval = setInterval(() => {
            if (this.ws && this.isConnected) {
                try {
                    this.ws.send('ping');
                } catch (error) {
                    console.error('Error sending keep-alive ping:', error);
                }
            }
        }, 30000); // 30 seconds
    }

    /**
     * Stop keep-alive ping
     */
    stopKeepAlive() {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = null;
        }
    }

    /**
     * Attempt to reconnect
     */
    attemptReconnect(token) {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnect attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * this.reconnectAttempts;

        console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

        setTimeout(() => {
            this.connect(token);
        }, delay);
    }

    /**
     * Disconnect WebSocket
     */
    disconnect() {
        this.stopKeepAlive();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
        this.messageHandlers = [];
    }

    /**
     * Request browser notification permission
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    /**
     * Get permission status
     */
    getPermissionStatus() {
        if (!('Notification' in window)) {
            return 'unsupported';
        }
        return Notification.permission;
    }

    /**
     * Check if connected
     */
    isWebSocketConnected() {
        return this.isConnected;
    }
}

// Create singleton instance
const websocketNotificationService = new WebSocketNotificationService();

export default websocketNotificationService;
