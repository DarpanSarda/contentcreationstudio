// app/publishing/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Grid3X3,
  List,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Edit,
  Trash2,
  RefreshCw,
  Filter,
  ChevronDown,
  Search,
  Plus,
  Eye,
  Share2,
  FileText,
  Hash,
  Target,
  Image,
  Mail,
  TrendingUp,
  BarChart3,
  CalendarDays
} from 'lucide-react';

export default function PublishingQueuePage() {
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    platform: 'all',
    status: 'all',
    dateRange: 'week'
  });

  const [scheduledContent, setScheduledContent] = useState([
    {
      id: '1',
      title: '10 AI Tools That Will Transform Your Marketing in 2025',
      type: 'Blog Post',
      platforms: ['WordPress', 'Medium'],
      scheduledDate: '2024-01-18',
      scheduledTime: '09:00 AM',
      status: 'scheduled',
      priority: 'high',
      estimatedTime: '2 min',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: '2',
      title: 'The Future of Remote Work: Trends and Predictions',
      type: 'LinkedIn Post',
      platforms: ['LinkedIn'],
      scheduledDate: '2024-01-18',
      scheduledTime: '02:00 PM',
      status: 'scheduled',
      priority: 'medium',
      estimatedTime: '1 min',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: '3',
      title: 'How to Build a Strong Brand Identity on Social Media',
      type: 'Twitter Thread',
      platforms: ['Twitter'],
      scheduledDate: '2024-01-17',
      scheduledTime: '11:30 AM',
      status: 'published',
      priority: 'low',
      estimatedTime: '1 min',
      publishedAt: '2024-01-17T11:30:00Z',
      engagement: { views: 1250, shares: 45, likes: 89 },
      externalUrl: 'https://twitter.com/example/status/123456789',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: '4',
      title: 'Email Marketing Best Practices for Q1 2024',
      type: 'Email Newsletter',
      platforms: ['Email'],
      scheduledDate: '2024-01-19',
      scheduledTime: '10:00 AM',
      status: 'scheduled',
      priority: 'high',
      estimatedTime: '3 min',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: '5',
      title: 'Instagram Growth Hacks You Need to Try',
      type: 'Instagram Caption',
      platforms: ['Instagram'],
      scheduledDate: '2024-01-17',
      scheduledTime: '06:00 PM',
      status: 'failed',
      priority: 'medium',
      estimatedTime: '1 min',
      errorMessage: 'Instagram API rate limit exceeded',
      retryCount: 2,
      thumbnail: '/api/placeholder/400/250'
    }
  ]);

  const [queueStats, setQueueStats] = useState({
    totalScheduled: 12,
    publishingToday: 3,
    thisWeek: 8,
    failed: 2,
    successfullyPublished: 156
  });

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'wordpress', label: 'WordPress', icon: <span className="text-blue-400">WP</span> },
    { value: 'medium', label: 'Medium', icon: <span className="text-green-400">M</span> },
    { value: 'twitter', label: 'Twitter', icon: <span className="text-cyan-400">X</span> },
    { value: 'linkedin', label: 'LinkedIn', icon: <span className="text-blue-600">LI</span> },
    { value: 'instagram', label: 'Instagram', icon: <span className="text-pink-500">IG</span> },
    { value: 'facebook', label: 'Facebook', icon: <span className="text-blue-500">FB</span> },
    { value: 'email', label: 'Email', icon: <span className="text-accent-orange">@</span> }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'scheduled', label: 'Scheduled', color: 'text-accent-yellow' },
    { value: 'published', label: 'Published', color: 'text-accent-green' },
    { value: 'failed', label: 'Failed', color: 'text-red-500' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'published': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30';
      case 'published': return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'failed': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-card-bg/20 text-text-muted border-white/20';
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Blog Post': <FileText className="w-4 h-4" />,
      'Twitter Thread': <Hash className="w-4 h-4" />,
      'LinkedIn Post': <Target className="w-4 h-4" />,
      'Instagram Caption': <Image className="w-4 h-4" />,
      'Facebook Post': <FileText className="w-4 h-4" />,
      'Email Newsletter': <Mail className="w-4 h-4" />
    };
    return icons[type] || <FileText className="w-4 h-4" />;
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      'WordPress': <span className="text-blue-400 text-xs font-bold">WP</span>,
      'Medium': <span className="text-green-400 text-xs font-bold">M</span>,
      'Twitter': <span className="text-cyan-400 text-xs font-bold">X</span>,
      'LinkedIn': <span className="text-blue-600 text-xs font-bold">LI</span>,
      'Facebook': <span className="text-blue-500 text-xs font-bold">FB</span>,
      'Instagram': <span className="text-pink-500 text-xs font-bold">IG</span>,
      'Email': <span className="text-accent-orange text-xs font-bold">@</span>
    };
    return icons[platform] || platform.charAt(0);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-accent-yellow';
      case 'low': return 'text-accent-green';
      default: return 'text-text-muted';
    }
  };

  const filteredContent = scheduledContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = filters.platform === 'all' ||
                          item.platforms.some(p => p.toLowerCase().includes(filters.platform.toLowerCase()));
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const CalendarView = () => {
    const daysInMonth = 31;
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-white/10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayContent = scheduledContent.filter(item => {
        const itemDate = new Date(item.scheduledDate);
        return itemDate.getDate() === day &&
               itemDate.getMonth() === selectedDate.getMonth() &&
               itemDate.getFullYear() === selectedDate.getFullYear();
      });

      days.push(
        <div
          key={day}
          className="p-2 border border-white/10 min-h-[100px] hover:bg-card-bg/10 transition-colors cursor-pointer"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-text-light">{day}</span>
            {dayContent.length > 0 && (
              <span className="text-xs bg-accent-orange/20 text-accent-orange px-1 rounded">
                {dayContent.length}
              </span>
            )}
          </div>
          <div className="space-y-1">
            {dayContent.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="text-xs p-1 bg-card-bg/50 rounded cursor-pointer hover:bg-card-bg/70 transition-colors"
                title={item.title}
              >
                <div className="flex items-center gap-1">
                  {getTypeIcon(item.type)}
                  <span className="truncate text-text-light">{item.title.substring(0, 15)}...</span>
                </div>
              </div>
            ))}
            {dayContent.length > 2 && (
              <div className="text-xs text-text-muted text-center">
                +{dayContent.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="glass rounded-xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-light">January 2024</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors">
              <ChevronDown className="w-4 h-4 text-text-light" />
            </button>
            <button className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors">
              <ChevronDown className="w-4 h-4 text-text-light transform rotate-180" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-xs font-medium text-text-muted py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const ContentView = ({ item }) => (
    <div className="flex items-start gap-4 p-4 border border-white/10 rounded-lg hover:bg-card-bg/10 transition-colors">
      {/* Thumbnail */}
      <div className="w-16 h-16 bg-gradient-to-br from-accent-orange/20 to-accent-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
        {getTypeIcon(item.type)}
      </div>

      {/* Content Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-text-light truncate">{item.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
            <div className="flex items-center gap-1">
              {getStatusIcon(item.status)}
              {item.status}
            </div>
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-text-muted mb-2">
          <span>{item.type}</span>
          <div className="flex items-center gap-1">
            {item.platforms.map((platform, idx) => (
              <div
                key={idx}
                className="w-5 h-5 bg-card-bg/50 border border-white/20 rounded flex items-center justify-center"
                title={platform}
              >
                {getPlatformIcon(platform)}
              </div>
            ))}
          </div>
          <span className={`font-medium ${getPriorityColor(item.priority)}`}>
            {item.priority} priority
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{item.scheduledDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{item.scheduledTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{item.estimatedTime}</span>
          </div>
        </div>

        {item.status === 'published' && item.engagement && (
          <div className="flex items-center gap-4 text-sm text-text-muted mt-2">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{item.engagement.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              <span>{item.engagement.shares}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              <span>{item.engagement.likes}</span>
            </div>
          </div>
        )}

        {item.status === 'failed' && item.errorMessage && (
          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {item.errorMessage}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        {item.status === 'published' && item.externalUrl && (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-text-light" />
          </a>
        )}
        <Link
          href={`/content/${item.id}/edit`}
          className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors"
        >
          <Edit className="w-4 h-4 text-text-light" />
        </Link>
        {item.status === 'failed' && (
          <button className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors">
            <RefreshCw className="w-4 h-4 text-text-light" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="sticky top-16 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-text-light">Publishing Queue</h1>
              <span className="text-sm text-text-muted">
                {queueStats.totalScheduled} scheduled items
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/content/new"
                className="flex items-center gap-2 px-4 py-2 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Schedule Content
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Queue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-accent-orange" />
              <span className="text-2xl font-bold text-text-light">{queueStats.totalScheduled}</span>
            </div>
            <p className="text-sm text-text-muted">Total Scheduled</p>
          </div>

          <div className="glass rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-accent-yellow" />
              <span className="text-2xl font-bold text-text-light">{queueStats.publishingToday}</span>
            </div>
            <p className="text-sm text-text-muted">Publishing Today</p>
          </div>

          <div className="glass rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <CalendarDays className="w-8 h-8 text-accent-cyan" />
              <span className="text-2xl font-bold text-text-light">{queueStats.thisWeek}</span>
            </div>
            <p className="text-sm text-text-muted">This Week</p>
          </div>

          <div className="glass rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-accent-green" />
              <span className="text-2xl font-bold text-text-light">{queueStats.successfullyPublished}</span>
            </div>
            <p className="text-sm text-text-muted">Published Successfully</p>
          </div>
        </div>

        {/* View Mode Toggle and Filters */}
        <div className="glass rounded-xl border border-white/10 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* View Mode */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-light">View:</span>
              <div className="flex items-center gap-1 bg-card-bg/20 border border-white/20 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'calendar' ? 'bg-accent-cyan text-dark-bg' : 'text-text-muted hover:text-text-light'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-accent-cyan text-dark-bg' : 'text-text-muted hover:text-text-light'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search content..."
                  className="w-full pl-10 pr-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {(filters.platform !== 'all' || filters.status !== 'all') && (
                  <span className="w-2 h-2 bg-accent-orange rounded-full"></span>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Platform</label>
                  <select
                    value={filters.platform}
                    onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
                    className="w-full px-3 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                  >
                    {platforms.map((platform) => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ platform: 'all', status: 'all', dateRange: 'week' })}
                    className="w-full px-3 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Display */}
        {viewMode === 'calendar' ? (
          <CalendarView />
        ) : (
          <div className="space-y-4">
            {filteredContent.length === 0 ? (
              <div className="glass rounded-xl border border-white/10 p-12 text-center">
                <div className="w-16 h-16 bg-card-bg/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-text-light mb-2">No scheduled content found</h3>
                <p className="text-text-muted mb-6">
                  {searchQuery ? 'Try adjusting your search terms' : 'Start scheduling your first piece of content'}
                </p>
                {!searchQuery && (
                  <Link
                    href="/content/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    Schedule Content
                  </Link>
                )}
              </div>
            ) : (
              filteredContent.map((item) => (
                <ContentView key={item.id} item={item} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}