// app/analytics/page.jsx
'use client';

import { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState('30');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('views');
  const [showCustomRange, setShowCustomRange] = useState(false);

  const [topLevelMetrics, setTopLevelMetrics] = useState({
    totalViews: 245678,
    totalEngagement: 12456,
    conversionRate: 3.8,
    averageTimeOnPage: 245,
    topPerformingPlatform: 'WordPress',
    monthlyGrowth: 12.5
  });

  const [platformPerformance, setPlatformPerformance] = useState([
    { platform: 'WordPress', views: 89234, engagement: 4567, conversions: 234, color: '#0073aa' },
    { platform: 'Medium', views: 45123, engagement: 2341, conversions: 123, color: '#00ab6b' },
    { platform: 'Twitter', views: 37891, engagement: 1987, conversions: 89, color: '#1da1f2' },
    { platform: 'LinkedIn', views: 32145, engagement: 1876, conversions: 156, color: '#0077b5' },
    { platform: 'Instagram', views: 28456, engagement: 1234, conversions: 67, color: '#e4405f' },
    { platform: 'Facebook', views: 12829, engagement: 451, conversions: 34, color: '#1877f2' }
  ]);

  const [contentTypePerformance, setContentTypePerformance] = useState([
    { type: 'Blog Post', count: 45, views: 156789, engagement: 8934, percentage: 65 },
    { type: 'Twitter Thread', count: 23, views: 45678, engagement: 2234, percentage: 19 },
    { type: 'LinkedIn Post', count: 18, views: 34567, engagement: 1234, percentage: 12 },
    { type: 'Instagram Caption', count: 12, views: 8644, engagement: 534, percentage: 4 }
  ]);

  const [performanceOverTime, setPerformanceOverTime] = useState([
    { date: '2024-01-01', views: 4567, engagement: 234, conversions: 12 },
    { date: '2024-01-02', views: 5234, engagement: 289, conversions: 15 },
    { date: '2024-01-03', views: 4789, engagement: 267, conversions: 14 },
    { date: '2024-01-04', views: 6123, engagement: 345, conversions: 18 },
    { date: '2024-01-05', views: 5890, engagement: 312, conversions: 17 },
    { date: '2024-01-06', views: 6456, engagement: 389, conversions: 21 },
    { date: '2024-01-07', views: 7123, engagement: 423, conversions: 23 }
  ]);

  const [topContent, setTopContent] = useState([
    {
      id: '1',
      title: '10 AI Tools That Will Transform Your Marketing in 2025',
      type: 'Blog Post',
      platforms: ['WordPress', 'Medium'],
      views: 15678,
      engagement: 892,
      conversionRate: 5.8,
      publishedDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'The Future of Remote Work: Trends and Predictions',
      type: 'LinkedIn Post',
      platforms: ['LinkedIn'],
      views: 12456,
      engagement: 734,
      conversionRate: 6.2,
      publishedDate: '2024-01-18'
    },
    {
      id: '3',
      title: 'How to Build a Strong Brand Identity on Social Media',
      type: 'Twitter Thread',
      platforms: ['Twitter'],
      views: 9876,
      engagement: 567,
      conversionRate: 4.9,
      publishedDate: '2024-01-17'
    },
    {
      id: '4',
      title: 'Email Marketing Best Practices for Q1 2024',
      type: 'Email Newsletter',
      platforms: ['Email'],
      views: 8234,
      engagement: 445,
      conversionRate: 12.3,
      publishedDate: '2024-01-12'
    },
    {
      id: '5',
      title: 'Instagram Growth Hacks You Need to Try',
      type: 'Instagram Caption',
      platforms: ['Instagram'],
      views: 7123,
      engagement: 389,
      conversionRate: 3.8,
      publishedDate: '2024-01-11'
    }
  ]);

  const [underperformingContent, setUnderperformingContent] = useState([
    {
      id: '6',
      title: 'Facebook Marketing in 2024: What Works',
      type: 'Facebook Post',
      platforms: ['Facebook'],
      views: 2345,
      engagement: 89,
      conversionRate: 1.2,
      publishedDate: '2024-01-10',
      suggestion: 'Add more engaging visuals and interactive elements'
    },
    {
      id: '7',
      title: 'Content Marketing Automation Guide',
      type: 'Blog Post',
      platforms: ['WordPress'],
      views: 3456,
      engagement: 123,
      conversionRate: 2.1,
      publishedDate: '2024-01-09',
      suggestion: 'Include more case studies and real-world examples'
    }
  ]);

  const [engagementMetrics, setEngagementMetrics] = useState({
    averageEngagementRate: 5.1,
    topEngagementHour: '14:00',
    bestPublishingDay: 'Tuesday',
    peakEngagementTime: 'Tuesday, 2:00 PM'
  });

  const getTrendIcon = (value, compareValue) => {
    if (value > compareValue) {
      return <ArrowUp className="w-4 h-4 text-accent-green" />;
    } else if (value < compareValue) {
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    }
    return <div className="w-4 h-4 bg-accent-yellow rounded-full" />;
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

  const MetricCard = ({ title, value, unit, change, icon: Icon, color }) => (
    <div className="glass rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-1">
          {getTrendIcon(change, 0)}
          <span className={`text-sm font-medium ${change > 0 ? 'text-accent-green' : change < 0 ? 'text-red-500' : 'text-accent-yellow'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
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
            title="Total Views"
            value={topLevelMetrics.totalViews}
            change={topLevelMetrics.monthlyGrowth}
            icon={Eye}
            color="bg-accent-orange/20"
          />
          <MetricCard
            title="Total Engagement"
            value={topLevelMetrics.totalEngagement}
            change={8.2}
            icon={Share2}
            color="bg-accent-cyan/20"
          />
          <MetricCard
            title="Conversion Rate"
            value={topLevelMetrics.conversionRate}
            unit="%"
            change={1.5}
            icon={Target}
            color="bg-accent-green/20"
          />
          <MetricCard
            title="Avg. Time on Page"
            value={Math.round(topLevelMetrics.averageTimeOnPage / 60)}
            unit="min"
            change={-2.1}
            icon={Clock}
            color="bg-accent-yellow/20"
          />
          <MetricCard
            title="Top Platform"
            value={topLevelMetrics.topPerformingPlatform}
            change={5.7}
            icon={Globe}
            color="bg-purple-500/20"
          />
          <MetricCard
            title="Monthly Growth"
            value={topLevelMetrics.monthlyGrowth}
            unit="%"
            change={2.3}
            icon={TrendingUp}
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
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === 'views' ? 'bg-accent-cyan text-dark-bg' : 'text-text-muted hover:text-text-light'
                  }`}
                >
                  Views
                </button>
                <button
                  onClick={() => setSelectedMetric('engagement')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedMetric === 'engagement' ? 'bg-accent-cyan text-dark-bg' : 'text-text-muted hover:text-text-light'
                  }`}
                >
                  Engagement
                </button>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="h-64 bg-card-bg/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-text-muted mx-auto mb-2" />
                <p className="text-text-muted">Performance Chart</p>
                <p className="text-sm text-text-muted mt-1">
                  {selectedMetric === 'views' ? 'Daily views across all platforms' : 'Daily engagement across all platforms'}
                </p>
              </div>
            </div>
          </div>

          {/* Platform Comparison */}
          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-text-light mb-6">Platform Comparison</h2>

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
          </div>
        </div>

        {/* Content Type Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-text-light mb-6">Content Type Performance</h2>

            {/* Pie Chart Placeholder */}
            <div className="h-48 bg-card-bg/10 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-text-muted mx-auto mb-2" />
                <p className="text-text-muted">Content Distribution</p>
              </div>
            </div>

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

          {/* Engagement Rate */}
          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-text-light mb-6">Engagement Insights</h2>

            <div className="space-y-6">
              <div className="p-4 bg-accent-green/20 border border-accent-green/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-accent-green" />
                  <div>
                    <p className="text-lg font-bold text-text-light">{engagementMetrics.averageEngagementRate}%</p>
                    <p className="text-sm text-text-muted">Average Engagement Rate</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card-bg/10 rounded-lg">
                  <p className="text-sm text-text-muted mb-1">Peak Engagement</p>
                  <p className="text-lg font-bold text-text-light">{engagementMetrics.peakEngagementTime}</p>
                </div>
                <div className="p-4 bg-card-bg/10 rounded-lg">
                  <p className="text-sm text-text-muted mb-1">Best Day</p>
                  <p className="text-lg font-bold text-text-light">{engagementMetrics.bestPublishingDay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Content Table */}
        <div className="glass rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-text-light mb-6">Top Performing Content</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-light">Content</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-light">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text-light">Platforms</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-light">Views</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-light">Engagement</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-text-light">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {topContent.map((content, index) => (
                  <tr key={content.id} className="border-b border-white/10 hover:bg-card-bg/10 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-text-light line-clamp-1">{content.title}</p>
                        <p className="text-xs text-text-muted">{content.publishedDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(content.type)}
                        <span className="text-sm text-text-light">{content.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {content.platforms.map((platform, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-card-bg/50 border border-white/20 rounded text-xs text-text-light"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-text-light">
                      {formatNumber(content.views)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-text-light">
                      {formatNumber(content.engagement)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium text-accent-green">{content.conversionRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Underperforming Content */}
        <div className="glass rounded-xl border border-white/10 p-6 mt-8">
          <h2 className="text-xl font-bold text-text-light mb-6">Content Optimization Opportunities</h2>

          <div className="space-y-4">
            {underperformingContent.map((content) => (
              <div key={content.id} className="flex items-start gap-4 p-4 bg-card-bg/10 border border-white/10 rounded-lg">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-text-light mb-1">{content.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <span>{content.type}</span>
                        <span>•</span>
                        <span>{formatNumber(content.views)} views</span>
                        <span>•</span>
                        <span className="text-red-500">{content.conversionRate}% conversion</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                    <p className="text-xs text-yellow-500">
                      <strong>Suggestion:</strong> {content.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}