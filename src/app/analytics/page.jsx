// app/analytics/page.jsx
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  Eye,
  Share2,
  Users,
  Clock,
  Target,
  FileText,
  Hash,
  ArrowUp,
  ArrowDown,
  Activity,
  Globe,
  Zap,
  Award,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Chart colors
const CHART_COLORS = ['#14F195', '#9945FF', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState('30');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('views');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);

  // Fetch analytics data on mount
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Refetch time-series data when metric or time range changes
  useEffect(() => {
    const fetchTimeSeries = async () => {
      try {
        const timeSeries = await apiClient.getTimeSeriesAnalytics(
          selectedMetric,
          parseInt(timeRange) || 30
        );
        if (timeSeries && timeSeries.data) {
          setTimeSeriesData(timeSeries.data);
        } else {
          setTimeSeriesData(generateSampleTimeSeriesData());
        }
      } catch (error) {
        console.error('Failed to fetch time-series data:', error);
        setTimeSeriesData(generateSampleTimeSeriesData());
      }
    };

    if (!loading) {
      fetchTimeSeries();
    }
  }, [selectedMetric, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [overview, platformData, workflowData, recentActivity, timeSeries] = await Promise.all([
        apiClient.getAnalyticsOverview(),
        apiClient.getPlatformAnalytics(),
        apiClient.getWorkflowAnalytics(20),
        apiClient.getRecentActivity(10),
        apiClient.getTimeSeriesAnalytics(selectedMetric, parseInt(timeRange) || 30).catch(err => {
          console.error('Time-series data not available:', err);
          return null;
        })
      ]);

      setAnalyticsData({
        overview,
        platforms: platformData,
        workflows: workflowData,
        activities: recentActivity
      });

      // Set time-series data if available, otherwise use sample data
      if (timeSeries && timeSeries.data) {
        setTimeSeriesData(timeSeries.data);
      } else {
        setTimeSeriesData(generateSampleTimeSeriesData());
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      // Use sample data as fallback
      setTimeSeriesData(generateSampleTimeSeriesData());
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Blog Post': <FileText className="w-4 h-4" />,
      'Twitter Thread': <Hash className="w-4 h-4" />,
      'LinkedIn Post': <Target className="w-4 h-4" />,
      'Instagram Caption': <Zap className="w-4 h-4" />,
      'Facebook Post': <FileText className="w-4 h-4" />,
      'Email Newsletter': <Activity className="w-4 h-4" />
    };
    return icons[type] || <FileText className="w-4 h-4" />;
  };

  const MetricCard = ({ title, value, unit, icon: Icon, color }) => (
    <div className="glass rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-text-light">
          {typeof value === 'number' ? formatNumber(value) : value}
          <span className="text-lg font-normal text-text-muted ml-1">{unit}</span>
        </p>
        <p className="text-sm text-text-muted">{title}</p>
      </div>
    </div>
  );

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent-cyan animate-spin mx-auto mb-4" />
          <p className="text-text-light">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const contentStats = analyticsData?.overview?.stats?.content || {};
  const workflowStats = analyticsData?.overview?.stats?.workflows || {};
  const publishingStats = analyticsData?.overview?.stats?.publishing || {};
  const platformsData = analyticsData?.platforms?.platforms || {};
  const workflowsList = analyticsData?.workflows?.workflows || [];
  const recentActivities = analyticsData?.activities?.activities || [];

  // Transform platforms data for display
  const platformPerformance = Object.keys(platformsData).length > 0
    ? Object.entries(platformsData).map(([name, data]) => {
      const colors = {
        'wordpress': '#0073aa',
        'medium': '#00ab6b',
        'twitter': '#1da1f2',
        'linkedin': '#0077b5',
        'instagram': '#e4405f',
        'facebook': '#1877f2'
      };
      return {
        platform: name,
        views: data.total_publications || 0,
        engagement: data.successful || 0,
        conversions: 0,
        color: colors[name.toLowerCase()] || '#FF652F'
      };
    })
    : [];

  // Transform content by type
  const contentByType = contentStats.by_type || {};
  const totalContentCount = Object.values(contentByType).reduce((a, b) => a + b, 0);
  const contentTypePerformance = Object.entries(contentByType).map(([type, count]) => ({
    type: type,
    count: count,
    views: 0,
    engagement: 0,
    percentage: totalContentCount > 0 ? Math.round((count / totalContentCount) * 100) : 0
  }));

  // Generate sample time series data (fallback when API is not available)
  const generateSampleTimeSeriesData = () => {
    const days = parseInt(timeRange) || 30;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

      // Generate sample data - in production, this would come from the API
      data.push({
        date: dateStr,
        views: Math.floor(Math.random() * 5000) + 1000,
        engagement: Math.floor(Math.random() * 1000) + 200,
      });
    }

    return data;
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="sticky top-16 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-text-light">Analytics Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={timeRange}
                  onChange={(e) => {
                    setTimeRange(e.target.value);
                    setShowCustomRange(e.target.value === 'custom');
                  }}
                  className="px-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="custom">Custom range</option>
                </select>

                {showCustomRange && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="px-3 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                    />
                    <span className="text-text-muted">to</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="px-3 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                    />
                  </div>
                )}
              </div>

              <button className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top-Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title="Total Content"
            value={contentStats.total || 0}
            icon={FileText}
            color="bg-accent-orange/20"
          />
          <MetricCard
            title="Published"
            value={contentStats.published || 0}
            icon={Share2}
            color="bg-accent-green/20"
          />
          <MetricCard
            title="Drafts"
            value={contentStats.drafts || 0}
            icon={Clock}
            color="bg-accent-cyan/20"
          />
          <MetricCard
            title="Scheduled"
            value={contentStats.scheduled || 0}
            icon={Calendar}
            color="bg-accent-yellow/20"
          />
          <MetricCard
            title="Total Workflows"
            value={workflowStats.total || 0}
            icon={Activity}
            color="bg-purple-500/20"
          />
          <MetricCard
            title="Publications"
            value={publishingStats.total_publications || 0}
            icon={Globe}
            color="bg-pink-500/20"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Over Time */}
          <div className="glass rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-light">Performance Over Time</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMetric('views')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${selectedMetric === 'views' ? 'bg-accent-cyan text-dark-bg' : 'text-text-muted hover:text-text-light'
                    }`}
                >
                  Views
                </button>
                <button
                  onClick={() => setSelectedMetric('engagement')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${selectedMetric === 'engagement' ? 'bg-accent-cyan text-dark-bg' : 'text-text-muted hover:text-text-light'
                    }`}
                >
                  Engagement
                </button>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timeSeriesData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14F195" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14F195" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#14F195"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMetric)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Comparison */}
          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-text-light mb-6">Platform Comparison</h2>

            {platformPerformance.length > 0 ? (
              <div className="space-y-4">
                {platformPerformance.map((platform) => (
                  <div key={platform.platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-light">{platform.platform}</span>
                      <span className="text-sm text-accent-cyan">{formatNumber(platform.views)}</span>
                    </div>
                    <div className="w-full bg-card-bg/50 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(platform.views / Math.max(...platformPerformance.map(p => p.views))) * 100}%`,
                          backgroundColor: platform.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Globe className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
                <p className="text-text-muted">No platform data available</p>
                <p className="text-sm text-text-muted mt-2">Connect platforms in Settings to see analytics</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Type Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-text-light mb-6">Content Type Performance</h2>

            {/* Pie Chart */}
            {contentTypePerformance.length > 0 ? (
              <div className="h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={contentTypePerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percentage }) => `${percentage}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {contentTypePerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 bg-card-bg/10 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-text-muted mx-auto mb-2" />
                  <p className="text-text-muted">No content data available</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {contentTypePerformance.map((type) => (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(type.type)}
                    <span className="text-sm text-text-light">{type.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-text-muted">{type.count} items</span>
                    <span className="text-accent-cyan">{type.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Statistics */}
          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-text-light mb-6">Workflow Statistics</h2>

            <div className="space-y-6">
              <div className="p-4 bg-accent-green/20 border border-accent-green/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-accent-green" />
                  <div>
                    <p className="text-lg font-bold text-text-light">{workflowStats.completed || 0}</p>
                    <p className="text-sm text-text-muted">Completed Workflows</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card-bg/10 rounded-lg">
                  <p className="text-sm text-text-muted mb-1">Running</p>
                  <p className="text-lg font-bold text-text-light">{workflowStats.running || 0}</p>
                </div>
                <div className="p-4 bg-card-bg/10 rounded-lg">
                  <p className="text-sm text-text-muted mb-1">Failed</p>
                  <p className="text-lg font-bold text-text-light">{workflowStats.failed || 0}</p>
                </div>
              </div>

              <div className="p-4 bg-card-bg/10 rounded-lg">
                <p className="text-sm text-text-muted mb-1">Success Rate</p>
                <p className="text-lg font-bold text-text-light">
                  {workflowStats.total > 0
                    ? Math.round((workflowStats.completed / workflowStats.total) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Workflows */}
        <div className="glass rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-text-light mb-6">Recent Workflows</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-light">Topic</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-light">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-light">Current Stage</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-light">Duration</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-light">Started</th>
                </tr>
              </thead>
              <tbody>
                {workflowsList.slice(0, 10).map((workflow) => (
                  <tr key={workflow.workflow_id} className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-text-light line-clamp-1">{workflow.topic}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${workflow.status === 'completed' ? 'bg-accent-green/20 text-accent-green border-accent-green/30' :
                        workflow.status === 'failed' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                          workflow.status === 'running' ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30' :
                            'bg-card-bg/20 text-text-muted border-white/20'
                        }`}>
                        {workflow.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-text-light capitalize">{workflow.current_stage || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-text-light">
                      {workflow.duration_minutes ? `${workflow.duration_minutes} min` : 'In progress'}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-text-muted">
                      {new Date(workflow.started_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {workflowsList.length === 0 && (
              <div className="text-center py-8">
                <p className="text-text-muted">No workflows yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-xl border border-white/10 p-6 mt-8">
          <h2 className="text-xl font-bold text-text-light mb-6">Recent Activity</h2>

          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-card-bg/10 border border-white/10 rounded-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.type === 'content_created' ? 'bg-accent-green/20' : 'bg-accent-cyan/20'
                    }`}>
                    {activity.type === 'content_created' ? (
                      <FileText className="w-5 h-5 text-accent-green" />
                    ) : (
                      <Globe className="w-5 h-5 text-accent-cyan" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-text-light mb-1">
                      {activity.type === 'content_created' ? activity.title : activity.content_title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      {activity.type === 'content_created' ? (
                        <>
                          <span>{activity.content_type}</span>
                          <span>•</span>
                          <span className={`${activity.status === 'published' ? 'text-accent-green' :
                            activity.status === 'scheduled' ? 'text-accent-yellow' :
                              'text-accent-cyan'
                            }`}>{activity.status}</span>
                        </>
                      ) : (
                        <>
                          <span>Published to {activity.platform}</span>
                          <span>•</span>
                          <span className={activity.status === 'success' ? 'text-accent-green' : 'text-red-500'}>
                            {activity.status}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-text-muted">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}