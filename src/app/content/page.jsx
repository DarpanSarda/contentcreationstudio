// app/content/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  Calendar,
  MoreVertical,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  RefreshCw,
  Share2,
  Mail,
  BookOpen
} from 'lucide-react';

// Content type configuration
const contentTypes = [
  {
    id: '',
    label: 'Content',
    icon: FileText,
    color: 'accent-cyan',
    bgColor: 'bg-accent-cyan/20',
    textColor: 'text-accent-cyan',
    borderColor: 'border-accent-cyan/30',
    description: 'Blog posts, social media, emails, articles'
  },
  {
    id: 'research',
    label: 'Research',
    icon: BookOpen,
    color: 'purple-500',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-500',
    borderColor: 'border-purple-500/30',
    description: 'Research documents'
  }
];

export default function ContentLibraryPage() {
  const router = useRouter();
  const toast = useToast();

  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(''); // Default to "All Content"
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    has_more: false
  });

  const [filters, setFilters] = useState({
    status: '',
    content_type: '', // Controlled by activeTab
    my_content: true
  });

  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
    other: 0
  });

  const [contentTypeCounts, setContentTypeCounts] = useState({
    '': 0,        // Content (all types except research)
    'research': 0  // Research only
  });

  // Fetch content on mount and when filters change
  useEffect(() => {
    fetchContent();
    fetchStats();
  }, [filters, pagination.offset]);

  // Sync activeTab with filters
  useEffect(() => {
    setFilters(prev => ({ ...prev, content_type: activeTab }));
  }, [activeTab]);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getAllContent({
        ...filters,
        limit: pagination.limit,
        offset: pagination.offset
      });

      let filteredContent = response.content || [];

      // If on Content tab (activeTab = ''), exclude research documents
      // If on Research tab (activeTab = 'research'), show only research documents
      if (activeTab === '') {
        // Content tab: exclude research
        filteredContent = filteredContent.filter(item => item.content_type !== 'research');
      } else if (activeTab === 'research') {
        // Research tab: only research
        filteredContent = filteredContent.filter(item => item.content_type === 'research');
      }

      setContent(filteredContent);
      setPagination(prev => ({
        ...prev,
        total: filteredContent.length,
        has_more: response.pagination?.has_more || false
      }));

      // Update content type counts based on ALL content (before filtering)
      updateContentTypeCounts(response.content || []);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const updateContentTypeCounts = (contentList) => {
    let researchCount = 0;
    let contentCount = 0;

    contentList.forEach(item => {
      const type = item.content_type || 'article';
      if (type === 'research') {
        researchCount++;
      } else {
        // Everything else goes to Content tab (blog-post, social-media, email, article, etc.)
        contentCount++;
      }
    });

    setContentTypeCounts({
      '': contentCount,
      'research': researchCount
    });
  };

  const fetchStats = async () => {
    try {
      const statsData = await apiClient.getContentStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchContent();
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.searchContent(searchQuery, filters.my_content);
      setContent(response.results || []);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (contentId) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      await apiClient.deleteContent(contentId);
      fetchContent();
      fetchStats();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDuplicate = async (contentId) => {
    try {
      await apiClient.duplicateContent(contentId);
      fetchContent();
      fetchStats();
    } catch (error) {
      console.error('Duplicate error:', error);
    }
  };

  const handleApprove = async (contentId) => {
    try {
      await apiClient.approveContent(contentId);
      fetchContent();
      fetchStats();
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { bg: 'bg-green-500/20', text: 'text-green-500', icon: CheckCircle },
      draft: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', icon: Clock },
      private: { bg: 'bg-gray-500/20', text: 'text-gray-500', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getContentTypeBadge = (contentType) => {
    // Define individual type badges
    const typeBadges = {
      'blog-post': { icon: FileText, label: 'Blog Post', bgColor: 'bg-orange-500/20', textColor: 'text-orange-500', borderColor: 'border-orange-500/30' },
      'social-media': { icon: Share2, label: 'Social Media', bgColor: 'bg-cyan-500/20', textColor: 'text-cyan-500', borderColor: 'border-cyan-500/30' },
      'email': { icon: Mail, label: 'Email', bgColor: 'bg-green-500/20', textColor: 'text-green-500', borderColor: 'border-green-500/30' },
      'article': { icon: FileText, label: 'Article', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-500', borderColor: 'border-yellow-500/30' },
      'research': { icon: BookOpen, label: 'Research', bgColor: 'bg-purple-500/20', textColor: 'text-purple-500', borderColor: 'border-purple-500/30' }
    };

    const badge = typeBadges[contentType] || typeBadges['article'];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bgColor} ${badge.textColor} border ${badge.borderColor}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const ContentCard = ({ item }) => (
    <div className="glass rounded-xl border border-white/10 overflow-hidden hover:border-accent-cyan/50 transition-all group relative">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-light mb-2 group-hover:text-accent-cyan transition-colors line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-text-muted line-clamp-2">{item.body?.substring(0, 100)}...</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusBadge(item.status)}
            {getContentTypeBadge(item.content_type || 'article')}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/content/${item.id}/edit`)}
              className="p-2 hover:bg-accent-cyan/20 rounded-lg transition-colors text-text-light hover:text-accent-cyan"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleDuplicate(item.id)}
              className="p-2 hover:bg-accent-orange/20 rounded-lg transition-colors text-text-light hover:text-accent-orange"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleDelete(item.id)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-text-light hover:text-red-500"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(item.created_at).toLocaleDateString()}
            </div>

            {item.status === 'draft' && (
              <button
                onClick={() => handleApprove(item.id)}
                className="text-accent-green hover:underline"
              >
                Publish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-bg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-light">Content Library</h1>
                <p className="text-text-muted mt-1">Manage and organize your content</p>
              </div>

              <Link
                href="/content/new"
                className="flex items-center gap-2 px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Create Content
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="glass rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-text-light">{stats.total}</div>
                <div className="text-sm text-text-muted">Total Content</div>
              </div>
              <div className="glass rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-green-500">{stats.published}</div>
                <div className="text-sm text-text-muted">Published</div>
              </div>
              <div className="glass rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-yellow-500">{stats.draft}</div>
                <div className="text-sm text-text-muted">Drafts</div>
              </div>
              <div className="glass rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-accent-cyan">{stats.other}</div>
                <div className="text-sm text-text-muted">Other</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content Type Tabs */}
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {contentTypes.map((type) => {
              const Icon = type.icon;
              const isActive = activeTab === type.id;
              const count = contentTypeCounts[type.id] || 0;

              return (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${isActive
                    ? `${type.bgColor} ${type.textColor} border-2 ${type.borderColor} shadow-lg`
                    : 'bg-card-bg/20 text-text-muted border-2 border-transparent hover:bg-card-bg/40 hover:text-text-light'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{type.label}</span>
                  {count > 0 && (
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass rounded-xl border border-white/10 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search content..."
                  className="w-full pl-10 pr-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan text-text-light"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="private">Private</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center gap-2 p-1 bg-card-bg/20 border border-white/20 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-accent-cyan text-dark-bg' : 'text-text-light hover:bg-white/10'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-accent-cyan text-dark-bg' : 'text-text-light hover:bg-white/10'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={fetchContent}
              className="px-4 py-3 bg-accent-cyan/20 text-accent-cyan rounded-lg hover:bg-accent-cyan/30 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent-orange border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-text-muted">Loading content...</span>
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-light mb-2">No content found</h3>
            <p className="text-text-muted mb-6">Start creating your first content piece</p>
            <Link
              href="/content/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Create Content
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {content.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-text-muted">
              Showing {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
                disabled={pagination.offset === 0}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                disabled={!pagination.has_more}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
