// app/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import {
  TrendingUp,
  FileText,
  Calendar,
  Clock,
  Activity,
  Plus,
  Eye,
  Edit,
  Loader2,
  RefreshCw,
  Zap,
  CheckCircle,
  XCircle,
  Pause,
  BarChart3,
  Globe,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  Share2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('views');
  const [chartTimeRange, setChartTimeRange] = useState('7');

  // State for all dashboard data
  const [stats, setStats] = useState({
    totalContent: 0,
    published: 0,
    scheduled: 0,
    drafts: 0
  });
  const [recentContent, setRecentContent] = useState([]);
  const [activeWorkflows, setActiveWorkflows] = useState([]);
  const [agentStatus, setAgentStatus] = useState([]);
  const [platformStatus, setPlatformStatus] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [workflowStats, setWorkflowStats] = useState({
    total: 0,
    completed: 0,
    running: 0,
    failed: 0
  });

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        analyticsOverview,
        myContent,
        agents,
        platforms,
        activity
      ] = await Promise.all([
        apiClient.getAnalyticsOverview(),
        apiClient.getMyContent(100, 0), // Fetch more content for accurate stats
        apiClient.getAgentStatus(),
        apiClient.getPlatformsStatus(),
        apiClient.getRecentActivity(5),
      ]);

      console.log('Dashboard data fetched:', {
        myContent,
        contentArray: myContent?.content,
        total: myContent?.total,
        length: myContent?.content?.length
      });

      // Update recent content
      setRecentContent(myContent?.content || []);

      // Calculate stats from actual content data
      const allContent = myContent?.content || [];
      const publishedCount = allContent.filter(c => c.status === 'published').length;
      const scheduledCount = allContent.filter(c => c.status === 'scheduled').length;
      const draftCount = allContent.filter(c => c.status === 'draft').length;

      // Calculate total - use pagination total if available, otherwise array length
      const totalCount = myContent?.pagination?.total || myContent?.total || allContent.length || 0;

      console.log('Calculated stats:', {
        totalCount,
        publishedCount,
        scheduledCount,
        draftCount,
        allContentLength: allContent.length
      });

      // Update stats with actual counts
      setStats({
        totalContent: totalCount,
        published: publishedCount,
        scheduled: scheduledCount,
        drafts: draftCount
      });

      // Update workflow stats from analytics if available
      if (analyticsOverview?.stats?.workflows) {
        setWorkflowStats({
          total: analyticsOverview.stats.workflows.total || 0,
          completed: analyticsOverview.stats.workflows.completed || 0,
          running: analyticsOverview.stats.workflows.running || 0,
          failed: analyticsOverview.stats.workflows.failed || 0
        });
      }

      // Find top performer (content with highest views)
      if (myContent?.content && myContent.content.length > 0) {
        const topPerformer = myContent.content.reduce((best, current) => {
          const bestViews = best?.analytics?.views || 0;
          const currentViews = current?.analytics?.views || 0;
          return currentViews > bestViews ? current : best;
        }, myContent.content[0]);

        // Set top performer as first item if it has analytics
        if (topPerformer?.analytics?.views > 0) {
          setRecentContent([topPerformer, ...myContent.content.filter(c => c.id !== topPerformer.id)]);
        }
      }

      // Update agent status
      if (agents?.agents) {
        setAgentStatus(agents.agents);
      } else {
        setAgentStatus([]);
      }

      // Update platform status
      if (platforms?.platforms) {
        const formattedPlatforms = Object.entries(platforms.platforms).map(([key, data]) => ({
          id: key,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          status: data.connected ? 'connected' : 'disconnected',
          lastSync: data.last_sync ? formatLastSync(data.last_sync) : 'Never',
          connectedAt: data.configured_at ? new Date(data.configured_at).toLocaleDateString() : null
        }));
        setPlatformStatus(formattedPlatforms);
      } else {
        setPlatformStatus([]);
      }

      // Update recent activity
      setRecentActivity(activity?.activities || []);

      // Set empty time-series data (not fetching from backend currently)
      setTimeSeriesData([]);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set empty states on error
      setStats({ totalContent: 0, published: 0, scheduled: 0, drafts: 0 });
      setRecentContent([]);
      setActiveWorkflows([]);
      setAgentStatus([]);
      setPlatformStatus([]);
      setRecentActivity([]);
      setTimeSeriesData([]);
    } finally {
      setLoading(false);
    }
  };


  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'scheduled': return 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30';
      case 'draft': return 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30';
      case 'running': return 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30';
      case 'idle': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'connected': return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'disconnected': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-card-bg/20 text-text-muted border-white/20';
    }
  };

  const getAgentIcon = (status) => {
    switch (status) {
      case 'running': return <Activity className="w-4 h-4 text-accent-green animate-pulse" />;
      case 'idle': return <Pause className="w-4 h-4 text-gray-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-text-muted" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return formatDate(timestamp);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent-cyan animate-spin mx-auto mb-4" />
          <p className="text-text-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-accent-orange/10 via-dark-bg to-accent-cyan/10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-light mb-2">
                {getGreeting()}, {user?.username || user?.email?.split('@')[0] || 'User'}!
              </h1>
              <p className="text-text-muted">Here's what's happening with your content today</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg hover:bg-card-bg/30 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent-orange/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent-orange" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-light">{stats.totalContent}</p>
                  <p className="text-xs text-text-muted">Total Content</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-light">{stats.published}</p>
                  <p className="text-xs text-text-muted">Published</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent-yellow/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent-yellow" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-light">{stats.scheduled}</p>
                  <p className="text-xs text-text-muted">Scheduled</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-accent-cyan/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent-cyan" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-light">{stats.drafts}</p>
                  <p className="text-xs text-text-muted">Drafts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/content/new"
            className="group glass rounded-xl p-4 border border-white/10 hover:border-accent-orange/50 transition-all hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent-orange/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent-orange/30 transition-colors">
                <Plus className="w-6 h-6 text-accent-orange" />
              </div>
              <p className="text-sm font-medium text-text-light">New Content</p>
            </div>
          </Link>

          <Link
            href="/workflow"
            className="group glass rounded-xl p-4 border border-white/10 hover:border-accent-cyan/50 transition-all hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent-cyan/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent-cyan/30 transition-colors">
                <Zap className="w-6 h-6 text-accent-cyan" />
              </div>
              <p className="text-sm font-medium text-text-light">Start Workflow</p>
            </div>
          </Link>

          <Link
            href="/analytics"
            className="group glass rounded-xl p-4 border border-white/10 hover:border-accent-green/50 transition-all hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent-green/30 transition-colors">
                <BarChart3 className="w-6 h-6 text-accent-green" />
              </div>
              <p className="text-sm font-medium text-text-light">Analytics</p>
            </div>
          </Link>

          <Link
            href="/agents"
            className="group glass rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition-all hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-500/30 transition-colors">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-sm font-medium text-text-light">AI Agents</p>
            </div>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">

            {/* Recent Content */}
            <div className="glass rounded-xl border border-white/10">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-text-light">Recent Content</h2>
                  <p className="text-xs text-text-muted mt-1">Your latest creations</p>
                </div>
                <Link href="/content" className="text-sm text-accent-cyan hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-white/10">
                {recentContent.length > 0 ? (
                  recentContent.map((content) => (
                    <div key={content.id} className="p-4 hover:bg-card-bg/10 transition-colors group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-text-light mb-1 line-clamp-1 group-hover:text-accent-cyan transition-colors">
                            {content.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-text-muted">
                            <span className="capitalize">{content.content_type || 'Article'}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full border text-xs ${getStatusColor(content.status)}`}>
                              {content.status}
                            </span>
                            <span>•</span>
                            <span>{formatDate(content.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/content/${content.id}/edit`}
                            className="p-2 rounded-lg hover:bg-accent-cyan/20 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Edit className="w-4 h-4 text-accent-cyan" />
                          </Link>
                          <button className="p-2 rounded-lg hover:bg-accent-green/20 transition-colors opacity-0 group-hover:opacity-100">
                            <Eye className="w-4 h-4 text-accent-green" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-orange/20 to-accent-yellow/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-accent-orange" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-light mb-2">No content yet</h3>
                    <p className="text-sm text-text-muted mb-4">Start creating amazing content with AI</p>
                    <Link
                      href="/content/new"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      Create your first content
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Insights & Upcoming */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Content Performance Insights */}
              <div className="glass rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-light">Top Performer</h3>
                    <p className="text-xs text-text-muted">This week's best content</p>
                  </div>
                </div>

                {recentContent.length > 0 ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-accent-green/5 border border-accent-green/20 rounded-lg">
                      <h4 className="text-sm font-medium text-text-light mb-2 line-clamp-2">
                        {recentContent[0].title}
                      </h4>
                      {recentContent[0].analytics ? (
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-text-muted">Views</p>
                            <p className="text-accent-green font-bold">
                              {recentContent[0].analytics.views?.toLocaleString() || '0'}
                            </p>
                          </div>
                          <div>
                            <p className="text-text-muted">Engagement</p>
                            <p className="text-accent-green font-bold">
                              {recentContent[0].analytics.engagement_rate || '0'}%
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-text-muted">Analytics data not available yet</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted">Published {formatDate(recentContent[0].created_at)}</span>
                      <Link href={`/content/${recentContent[0].id}/edit`} className="text-accent-cyan hover:underline">
                        View details →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-text-muted">No published content yet</p>
                  </div>
                )}
              </div>

              {/* Upcoming Scheduled */}
              <div className="glass rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent-yellow/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-accent-yellow" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-light">Upcoming</h3>
                    <p className="text-xs text-text-muted">Scheduled to publish</p>
                  </div>
                </div>

                {stats.scheduled > 0 ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-accent-yellow/5 border border-accent-yellow/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text-light">{stats.scheduled} post{stats.scheduled > 1 ? 's' : ''} ready</span>
                        <span className="text-xs text-accent-yellow font-medium">Scheduled</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Globe className="w-3 h-3" />
                        <span>View scheduled content for details</span>
                      </div>
                    </div>

                    <Link
                      href="/content?status=scheduled"
                      className="block text-center text-xs text-accent-cyan hover:underline"
                    >
                      View all scheduled →
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-text-muted mb-3">No scheduled posts</p>
                    <Link
                      href="/content/new"
                      className="text-xs text-accent-cyan hover:underline"
                    >
                      Schedule a post →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* AI Recommendations */}
            {/* <div className="glass rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-light">AI Recommendations</h3>
                    <p className="text-xs text-text-muted">Personalized suggestions</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-card-bg/10 rounded-lg border border-white/10 hover:border-purple-500/30 transition-all group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-text-light mb-1 group-hover:text-purple-400 transition-colors">
                        Optimize posting time
                      </h4>
                      <p className="text-xs text-text-muted">
                        Your audience is most active at 2-4 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-card-bg/10 rounded-lg border border-white/10 hover:border-purple-500/30 transition-all group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-text-light mb-1 group-hover:text-purple-400 transition-colors">
                        Trending topics
                      </h4>
                      <p className="text-xs text-text-muted">
                        "AI automation" is trending in your niche
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-card-bg/10 rounded-lg border border-white/10 hover:border-purple-500/30 transition-all group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-text-light mb-1 group-hover:text-purple-400 transition-colors">
                        Content gap
                      </h4>
                      <p className="text-xs text-text-muted">
                        Consider creating video content
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            {/* AI Agent Status */}
            <div className="glass rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-text-light mb-4">AI Agents</h2>
              <div className="space-y-3">
                {agentStatus.length > 0 ? (
                  agentStatus.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-3 bg-card-bg/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getAgentIcon(agent.status)}
                        <div>
                          <p className="text-sm font-medium text-text-light">{agent.name}</p>
                          <p className="text-xs text-text-muted">
                            {agent.queueLength > 0 ? `${agent.queueLength} in queue` : 'Idle'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-text-muted text-center py-4">No agent data available</p>
                )}
              </div>
            </div>

            {/* Platform Status */}
            <div className="glass rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-text-light mb-4">Platforms</h2>
              <div className="space-y-3">
                {platformStatus.length > 0 ? (
                  platformStatus.map((platform, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-light">{platform.name}</p>
                        <p className="text-xs text-text-muted">
                          {platform.lastSync ? `Synced ${formatTime(platform.lastSync)}` : 'Never synced'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(platform.status)}`}>
                        {platform.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Globe className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-text-muted mb-2">No platforms connected</p>
                    <Link href="/settings" className="text-xs text-accent-cyan hover:underline">
                      Connect platforms
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-text-light mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-accent-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        {activity.type === 'content_created' ? (
                          <FileText className="w-4 h-4 text-accent-cyan" />
                        ) : (
                          <Share2 className="w-4 h-4 text-accent-green" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-light line-clamp-1">
                          {activity.title || activity.content_title || 'Activity'}
                        </p>
                        <p className="text-xs text-text-muted">{formatTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-text-muted text-center py-4">No recent activity</p>
                )}
              </div>
            </div>

            {/* Workflow Stats */}
            <div className="glass rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-text-light mb-4">Workflow Stats</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-accent-green/10 rounded-lg border border-accent-green/30">
                  <p className="text-xs text-text-muted mb-1">Completed</p>
                  <p className="text-xl font-bold text-accent-green">{workflowStats.completed}</p>
                </div>
                <div className="p-3 bg-accent-cyan/10 rounded-lg border border-accent-cyan/30">
                  <p className="text-xs text-text-muted mb-1">Running</p>
                  <p className="text-xl font-bold text-accent-cyan">{workflowStats.running}</p>
                </div>
                <div className="p-3 bg-card-bg/10 rounded-lg border border-white/10">
                  <p className="text-xs text-text-muted mb-1">Total</p>
                  <p className="text-xl font-bold text-text-light">{workflowStats.total}</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                  <p className="text-xs text-text-muted mb-1">Failed</p>
                  <p className="text-xl font-bold text-red-500">{workflowStats.failed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}