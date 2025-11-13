// components/layout/AppNavigation.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  User
} from 'lucide-react';

export default function AppNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
      name: 'Publishing Queue',
      href: '/publishing',
      icon: Calendar,
      current: pathname === '/publishing'
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
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: pathname === '/settings'
    }
  ];

  const [userProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'S'
  });

  const [showUserMenu, setShowUserMenu] = useState(false);

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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  item.current
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
            <button className="relative p-2 rounded-lg hover:bg-card-bg/20 transition-colors">
              <Bell className="w-4 h-4 text-text-light" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-orange rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-card-bg/20 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {userProfile.avatar}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 glass border border-white/10 rounded-lg py-2 shadow-xl">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-text-light">{userProfile.name}</p>
                    <p className="text-xs text-text-muted">{userProfile.email}</p>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-text-light hover:bg-card-bg/20 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-2 text-text-light hover:bg-card-bg/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Link>
                </div>
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
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${
                  item.current
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