// app/content/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Eye,
  Edit,
  Trash2,
  Share2,
  Calendar,
  MoreVertical,
  FileText,
  Hash,
  Target,
  Image,
  Mail,
  TrendingUp,
  Users,
  ChevronDown,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

export default function ContentLibraryPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [filters, setFilters] = useState({
    status: 'all',
    contentType: 'all',
    platform: 'all',
    dateRange: 'all'
  });

  const [content, setContent] = useState([
    {
      id: '1',
      title: '10 AI Tools That Will Transform Your Marketing in 2025',
      excerpt: 'Discover the cutting-edge AI tools that are revolutionizing digital marketing strategies...',
      type: 'Blog Post',
      status: 'published',
      platforms: ['WordPress', 'Medium'],
      views: 1250,
      shares: 45,
      likes: 89,
      created: '2024-01-15',
      updated: '2024-01-15',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: '2',
      title: 'The Future of Remote Work: Trends and Predictions',
      excerpt: 'As we navigate the new normal of remote work, several key trends are emerging...',
      type: 'LinkedIn Post',
      status: 'scheduled',
      platforms: ['LinkedIn'],
      scheduledFor: '2024-01-18',
      created: '2024-01-14',
      updated: '2024-01-14',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: '3',
      title: 'How to Build a Strong Brand Identity on Social Media',
      excerpt: 'Building a memorable brand identity requires consistent messaging, visual elements...',
      type: 'Twitter Thread',
      status: 'draft',
      platforms: ['Twitter'],
      created: '2024-01-13',
      updated: '2024-01-13',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: '4',
      title: 'Email Marketing Best Practices for Q1 2024',
      excerpt: 'Start your year strong with these proven email marketing strategies that drive results...',
      type: 'Email Newsletter',
      status: 'published',
      platforms: ['Email'],
      views: 3420,
      shares: 23,
      likes: 156,
      created: '2024-01-12',
      updated: '2024-01-12',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: '5',
      title: 'Instagram Growth Hacks You Need to Try',
      excerpt: 'Unlock the secrets to rapid Instagram growth with these actionable strategies...',
      type: 'Instagram Caption',
      status: 'published',
      platforms: ['Instagram'],
      views: 890,
      shares: 67,
      likes: 234,
      created: '2024-01-11',
      updated: '2024-01-11',
      thumbnail: '/api/placeholder/400/250'
    },
    {
      id: '6',
      title: 'Facebook Marketing in 2024: What Works',
      excerpt: 'Navigate the evolving landscape of Facebook marketing with these proven techniques...',
      type: 'Facebook Post',
      status: 'failed',
      platforms: ['Facebook'],
      created: '2024-01-10',
      updated: '2024-01-10',
      errorMessage: 'API rate limit exceeded',
      thumbnail: '/api/placeholder/400/250'
    }
  ]);

  const contentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'blog-post', label: 'Blog Post' },
    { value: 'twitter-thread', label: 'Twitter Thread' },
    { value: 'linkedin-post', label: 'LinkedIn Post' },
    { value: 'instagram-caption', label: 'Instagram Caption' },
    { value: 'facebook-post', label: 'Facebook Post' },
    { value: 'email-newsletter', label: 'Email Newsletter' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'draft', label: 'Draft' },
    { value: 'failed', label: 'Failed' }
  ];

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'wordpress', label: 'WordPress' },
    { value: 'medium', label: 'Medium' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date Created' },
    { value: 'updated', label: 'Last Updated' },
    { value: 'title', label: 'Title' },
    { value: 'views', label: 'Views' },
    { value: 'engagement', label: 'Engagement' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'scheduled': return 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30';
      case 'draft': return 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30';
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

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    const matchesType = filters.contentType === 'all' ||
                        item.type.toLowerCase().replace(' ', '-') === filters.contentType;
    const matchesPlatform = filters.platform === 'all' ||
                           item.platforms.some(p => p.toLowerCase() === filters.platform);

    return matchesSearch && matchesStatus && matchesType && matchesPlatform;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.created) - new Date(a.created);
      case 'updated':
        return new Date(b.updated) - new Date(a.updated);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'views':
        return (b.views || 0) - (a.views || 0);
      case 'engagement':
        return ((b.shares || 0) + (b.likes || 0)) - ((a.shares || 0) + (a.likes || 0));
      default:
        return 0;
    }
  });

  const toggleSelection = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === sortedContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedContent.map(item => item.id));
    }
  };

  const bulkDelete = () => {
    // TODO: Implement bulk delete
    console.log('Bulk delete:', selectedItems);
  };

  const bulkPublish = () => {
    // TODO: Implement bulk publish
    console.log('Bulk publish:', selectedItems);
  };

  const ContentCard = ({ item }) => (
    <div className={`glass rounded-xl border ${
      selectedItems.includes(item.id) ? 'border-accent-cyan' : 'border-white/10'
    } overflow-hidden hover:scale-[1.02] transition-all cursor-pointer group`}>
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-accent-orange/20 to-accent-cyan/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <FileText className="w-12 h-12 text-text-muted" />
        </div>
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => toggleSelection(item.id)}
            className="w-4 h-4 rounded accent-accent-cyan"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {getTypeIcon(item.type)}
          <span className="text-sm text-text-muted">{item.type}</span>
        </div>

        <h3 className="font-semibold text-text-light mb-2 line-clamp-2 group-hover:text-accent-cyan transition-colors">
          {item.title}
        </h3>

        <p className="text-sm text-text-muted mb-3 line-clamp-2">
          {item.excerpt}
        </p>

        {/* Platforms */}
        <div className="flex items-center gap-2 mb-3">
          {item.platforms.map((platform, idx) => (
            <div
              key={idx}
              className="w-6 h-6 bg-card-bg/50 border border-white/20 rounded flex items-center justify-center"
              title={platform}
            >
              {getPlatformIcon(platform)}
            </div>
          ))}
        </div>

        {/* Stats */}
        {item.views && (
          <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {item.views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              {item.shares}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {item.likes}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">{item.created}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              href={`/content/${item.id}/edit`}
              className="p-1.5 rounded hover:bg-card-bg/20 transition-colors"
            >
              <Edit className="w-4 h-4 text-text-light" />
            </Link>
            <button className="p-1.5 rounded hover:bg-card-bg/20 transition-colors">
              <MoreVertical className="w-4 h-4 text-text-light" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {item.status === 'failed' && item.errorMessage && (
          <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
            <p className="text-xs text-red-500">{item.errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );

  const ContentListItem = ({ item }) => (
    <div className={`glass border ${
      selectedItems.includes(item.id) ? 'border-accent-cyan' : 'border-white/10'
    } rounded-lg p-4 hover:bg-card-bg/5 transition-all`}>
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          onChange={() => toggleSelection(item.id)}
          className="w-4 h-4 rounded accent-accent-cyan"
        />

        {/* Thumbnail */}
        <div className="w-16 h-16 bg-gradient-to-br from-accent-orange/20 to-accent-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
          {getTypeIcon(item.type)}
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-text-light truncate">{item.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
          <p className="text-sm text-text-muted mb-2 line-clamp-1">{item.excerpt}</p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
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
            {item.views && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {item.views.toLocaleString()}
                </div>
              </>
            )}
            <span>•</span>
            <span>{item.created}</span>
          </div>
          {item.status === 'failed' && item.errorMessage && (
            <div className="mt-2 text-xs text-red-500">{item.errorMessage}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/content/${item.id}/edit`}
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
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Page Header */}
      <div className="bg-dark-bg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
            <div>
              <h1 className="text-3xl font-bold text-text-light">Content Library</h1>
              <p className="text-text-muted mt-1">
                {sortedContent.length} item{sortedContent.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <Link
              href="/content/new"
              className="flex items-center gap-2 px-4 py-2 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 w-fit"
            >
              <Plus className="w-4 h-4" />
              New Content
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="glass rounded-xl border border-white/10 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search content by title, keywords..."
                  className="w-full pl-10 pr-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-card-bg/20 border border-white/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-accent-cyan text-dark-bg' : 'text-text-muted hover:text-text-light'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
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

            {/* Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {(filters.status !== 'all' || filters.contentType !== 'all' ||
                  filters.platform !== 'all') && (
                  <span className="w-2 h-2 bg-accent-orange rounded-full"></span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all pr-10"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Content Type</label>
                  <select
                    value={filters.contentType}
                    onChange={(e) => setFilters(prev => ({ ...prev, contentType: e.target.value }))}
                    className="w-full px-3 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                  >
                    {contentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

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

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ status: 'all', contentType: 'all', platform: 'all', dateRange: 'all' })}
                    className="w-full px-3 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === sortedContent.length}
                    onChange={selectAll}
                    className="w-4 h-4 rounded accent-accent-cyan"
                  />
                  <span className="text-sm text-text-light">
                    {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={bulkPublish}
                    className="px-4 py-2 bg-accent-green hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors"
                  >
                    <Share2 className="w-4 h-4 inline mr-2" />
                    Publish
                  </button>
                  <button
                    onClick={bulkDelete}
                    className="px-4 py-2 bg-red-500 hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedItems([])}
                    className="px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light"
                  >
                    <X className="w-4 h-4 inline mr-2" />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Grid/List */}
        {sortedContent.length === 0 ? (
          <div className="glass rounded-xl border border-white/10 p-12 text-center">
            <div className="w-16 h-16 bg-card-bg/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text-light mb-2">No content found</h3>
            <p className="text-text-muted mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Start by creating your first piece of content'}
            </p>
            {!searchQuery && (
              <Link
                href="/content/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Create Content
              </Link>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {sortedContent.map((item) => (
              viewMode === 'grid' ? (
                <ContentCard key={item.id} item={item} />
              ) : (
                <ContentListItem key={item.id} item={item} />
              )
            ))}
          </div>
        )}
      </main>
    </div>
  );
}