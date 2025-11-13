// app/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  FileText,
  Calendar,
  Clock,
  Activity,
  Users,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Search,
  Filter,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'S'
  });

  const [stats, setStats] = useState({
    totalContent: 156,
    published: 89,
    scheduled: 12,
    drafts: 55
  });

  const [recentContent, setRecentContent] = useState([
    {
      id: '1',
      title: '10 AI Tools That Will Transform Your Marketing in 2025',
      type: 'Blog Post',
      status: 'published',
      platforms: ['WordPress', 'Medium'],
      views: 1250,
      shares: 45,
      created: '2024-01-15'
    },
    {
      id: '2',
      title: 'The Future of Remote Work: Trends and Predictions',
      type: 'LinkedIn Post',
      status: 'scheduled',
      platforms: ['LinkedIn'],
      scheduledFor: '2024-01-18',
      created: '2024-01-14'
    },
    {
      id: '3',
      title: 'How to Build a Strong Brand Identity on Social Media',
      type: 'Twitter Thread',
      status: 'draft',
      platforms: ['Twitter'],
      created: '2024-01-13'
    }
  ]);

  const [activeWorkflows, setActiveWorkflows] = useState([
    {
      id: 'wf1',
      title: 'Content about AI in Healthcare',
      currentStep: 'research',
      progress: 35,
      estimatedTime: '12 min'
    },
    {
      id: 'wf2',
      title: 'Social Media Campaign Q1',
      currentStep: 'writing',
      progress: 65,
      estimatedTime: '8 min'
    }
  ]);

  const [platformConnections, setPlatformConnections] = useState([
    { name: 'WordPress', status: 'connected', lastSync: '2 hours ago' },
    { name: 'LinkedIn', status: 'connected', lastSync: '1 hour ago' },
    { name: 'Twitter', status: 'error', lastSync: '1 day ago' },
    { name: 'Medium', status: 'connected', lastSync: '3 hours ago' }
  ]);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'scheduled': return 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30';
      case 'draft': return 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30';
      default: return 'bg-card-bg/20 text-text-muted border-white/20';
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      'WordPress': <span className="text-blue-400">WP</span>,
      'Medium': <span className="text-green-400">M</span>,
      'LinkedIn': <span className="text-blue-600">LI</span>,
      'Twitter': <span className="text-cyan-400">X</span>
    };
    return icons[platform] || platform.charAt(0);
  };

  const getConnectionStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'error': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-card-bg/20 text-text-muted border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Dashboard Header */}
      <header className="sticky top-16 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-text-light">Dashboard</h1>
              <p className="text-sm text-text-muted">Welcome back, {userProfile.name}</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-card-bg/20 border border-white/20 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="bg-transparent text-text-light placeholder-text-muted text-sm outline-none w-48"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-card-bg/20 transition-colors">
                <Bell className="w-5 h-5 text-text-light" />
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
                  <MoreVertical className="w-4 h-4 text-text-light" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 glass border border-white/10 rounded-lg py-2 shadow-xl">
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-text-light hover:bg-card-bg/20 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button className="flex items-center gap-3 px-4 py-2 text-text-light hover:bg-card-bg/20 transition-colors w-full text-left">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent-orange" />
              </div>
              <span className="text-sm text-text-muted">+12% this week</span>
            </div>
            <h3 className="text-2xl font-bold text-text-light mb-1">{stats.totalContent}</h3>
            <p className="text-text-muted">Total Content</p>
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-green" />
              </div>
              <span className="text-sm text-text-muted">+8% this week</span>
            </div>
            <h3 className="text-2xl font-bold text-text-light mb-1">{stats.published}</h3>
            <p className="text-text-muted">Published</p>
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-yellow/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent-yellow" />
              </div>
              <span className="text-sm text-text-muted">3 today</span>
            </div>
            <h3 className="text-2xl font-bold text-text-light mb-1">{stats.scheduled}</h3>
            <p className="text-text-muted">Scheduled</p>
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-cyan/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent-cyan" />
              </div>
              <span className="text-sm text-text-muted">5 in progress</span>
            </div>
            <h3 className="text-2xl font-bold text-text-light mb-1">{stats.drafts}</h3>
            <p className="text-text-muted">Drafts</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-bold text-text-light mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/content/new"
              className="flex flex-col items-center justify-center p-4 bg-accent-orange/10 border border-accent-orange/30 rounded-lg hover:bg-accent-orange/20 transition-colors group"
            >
              <Plus className="w-8 h-8 text-accent-orange mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-text-light">New Content</span>
            </Link>

            <button className="flex flex-col items-center justify-center p-4 bg-card-bg/20 border border-white/20 rounded-lg hover:bg-card-bg/30 transition-colors group">
              <Calendar className="w-8 h-8 text-accent-cyan mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-text-light">View Queue</span>
            </button>

            <button className="flex flex-col items-center justify-center p-4 bg-card-bg/20 border border-white/20 rounded-lg hover:bg-card-bg/30 transition-colors group">
              <TrendingUp className="w-8 h-8 text-accent-green mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-text-light">Analytics</span>
            </button>

            <button className="flex flex-col items-center justify-center p-4 bg-card-bg/20 border border-white/20 rounded-lg hover:bg-card-bg/30 transition-colors group">
              <Activity className="w-8 h-8 text-accent-yellow mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-text-light">Active Workflows</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Content */}
          <div className="lg:col-span-2">
            <div className="glass rounded-xl border border-white/10">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-text-light">Recent Content</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-card-bg/20 border border-white/20 rounded-lg p-1">
                      {['all', 'published', 'scheduled', 'draft'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setActiveFilter(filter)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            activeFilter === filter
                              ? 'bg-accent-orange text-white'
                              : 'text-text-muted hover:text-text-light'
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/10">
                {recentContent.map((content) => (
                  <div key={content.id} className="p-6 hover:bg-card-bg/10 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-text-light mb-2 line-clamp-2">
                          {content.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                          <span className="capitalize">{content.type}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(content.status)}`}>
                            {content.status}
                          </span>
                          {content.scheduledFor && (
                            <span>Scheduled: {content.scheduledFor}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            {content.platforms.map((platform, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 bg-card-bg/50 border border-white/20 rounded flex items-center justify-center text-xs font-bold"
                                title={platform}
                              >
                                {getPlatformIcon(platform)}
                              </div>
                            ))}
                          </div>
                          {content.views && (
                            <div className="flex items-center gap-1 text-sm text-text-muted">
                              <Eye className="w-4 h-4" />
                              {content.views.toLocaleString()}
                            </div>
                          )}
                          {content.shares && (
                            <div className="flex items-center gap-1 text-sm text-text-muted">
                              <Users className="w-4 h-4" />
                              {content.shares}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          href={`/content/${content.id}/edit`}
                          className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-text-light" />
                        </Link>
                        <button className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors">
                          <MoreVertical className="w-4 h-4 text-text-light" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Workflows */}
            <div className="glass rounded-xl border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-bold text-text-light">Active Workflows</h2>
              </div>
              <div className="p-6 space-y-4">
                {activeWorkflows.map((workflow) => (
                  <div key={workflow.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-text-light line-clamp-2">
                        {workflow.title}
                      </h3>
                      <span className="text-xs text-text-muted">{workflow.estimatedTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted capitalize">{workflow.currentStep}</span>
                      <span className="text-accent-cyan">{workflow.progress}%</span>
                    </div>
                    <div className="w-full bg-card-bg/50 rounded-full h-1.5">
                      <div
                        className="bg-accent-cyan h-1.5 rounded-full transition-all"
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Connections */}
            <div className="glass rounded-xl border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-bold text-text-light">Platform Status</h2>
              </div>
              <div className="p-6 space-y-3">
                {platformConnections.map((platform, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-light">{platform.name}</p>
                      <p className="text-xs text-text-muted">Synced {platform.lastSync}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getConnectionStatusColor(platform.status)}`}>
                      {platform.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}