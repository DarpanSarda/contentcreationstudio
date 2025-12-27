// components/layout/AppNavigation.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  Home,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Activity,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  BookOpen,
  HelpCircle
} from 'lucide-react';

export default function AppNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: pathname === '/dashboard'
    },
    {
      name: 'Content',
      href: '/content',
      icon: FileText,
      current: pathname.startsWith('/content')
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      current: pathname === '/analytics'
    },
    {
      name: 'Agents',
      href: '/agents',
      icon: Activity,
      current: pathname === '/agents'
    },
    {
      name: 'Support',
      href: '/support',
      icon: HelpCircle,
      current: pathname === '/support'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: pathname === '/settings'
    }
  ];

  // Handle logout
  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
    router.push('/');
  };

  // Get user initials for avatar
  const getUserInitials = (user) => {
    if (!user) return 'U';
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-lg flex items-center justify-center font-bold text-xl transition-transform group-hover:scale-110">
              C
            </div>
            <span className="text-xl font-bold">
              Content<span className="text-accent-orange">Studio</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${item.current
                  ? 'bg-accent-orange/20 text-accent-orange'
                  : 'text-text-light hover:text-accent-cyan hover:bg-card-bg/20'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="hidden md:flex items-center gap-2 p-2 rounded-lg hover:bg-card-bg/20 transition-colors">
              <Search className="w-4 h-4 text-text-light" />
            </button>

            {/* Notifications */}
            <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-card-bg/20 transition-colors">
              <Bell className="w-4 h-4 text-text-light" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-orange text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-card-bg/20 transition-all"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  {getUserInitials(user)}
                </div>
              </button>

              {showUserMenu && (
                <>
                  {/* Backdrop - only covers content below navbar */}
                  <div
                    className="fixed top-16 left-0 right-0 bottom-0 bg-black/60 z-40"
                    onClick={() => setShowUserMenu(false)}
                  ></div>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-3 w-72 glass border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* User Info Section */}
                    <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-br from-accent-orange/10 to-accent-yellow/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg">
                          {getUserInitials(user)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-text-light truncate">
                            {user?.username || 'User'}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>

                      {/* Quick Stats or Badge (Optional) */}
                      <div className="flex items-center gap-2 text-xs">
                        <div className="px-2 py-1 bg-accent-cyan/20 text-accent-cyan rounded-full font-medium">
                          Free Plan
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-5 py-3 text-text-light hover:bg-accent-orange/10 hover:text-accent-orange transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-card-bg/30 flex items-center justify-center group-hover:bg-accent-orange/20 transition-colors">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Profile Settings</p>
                          <p className="text-xs text-text-muted">Manage your account</p>
                        </div>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-5 py-3 text-text-light hover:bg-red-500/10 hover:text-red-500 transition-all w-full text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-card-bg/30 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Sign Out</p>
                          <p className="text-xs text-text-muted">Logout from your account</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-card-bg/20"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${item.current
                  ? 'bg-accent-orange/20 text-accent-orange'
                  : 'text-text-light hover:text-accent-cyan hover:bg-card-bg/20'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 text-text-light hover:text-accent-cyan hover:bg-card-bg/20 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-3 px-3 py-2 text-text-light hover:text-accent-cyan hover:bg-card-bg/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}