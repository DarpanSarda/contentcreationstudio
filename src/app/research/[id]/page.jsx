// app/research/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  CheckCircle,
  AlertCircle,
  Bookmark,
  ExternalLink,
  Download,
  TrendingUp,
  BarChart3,
  FileText,
  Clock,
  Star,
  Filter,
  Copy,
  Eye,
  Plus,
  X
} from 'lucide-react';

export default function ResearchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [researchData, setResearchData] = useState({
    id: params.id,
    topic: 'AI Marketing Tools and Strategies for 2025',
    completedAt: '2024-01-15T14:30:00Z',
    sourcesFound: 47,
    statisticsCount: 23,
    overallScore: 92,
    credibilityScore: 88
  });

  const [keyFindings, setKeyFindings] = useState([
    {
      id: '1',
      finding: 'AI adoption in marketing has increased by 45% in 2024, with small businesses leading the charge',
      sourceId: 'src1',
      sourceTitle: 'Marketing AI Adoption Report 2024',
      credibility: 95,
      category: 'Adoption Trends'
    },
    {
      id: '2',
      finding: 'Content generation AI tools can reduce content creation time by up to 80% while maintaining quality standards',
      sourceId: 'src2',
      sourceTitle: 'Content Automation Study',
      credibility: 88,
      category: 'Efficiency'
    },
    {
      id: '3',
      finding: 'Personalization engines powered by AI show 300% higher conversion rates compared to traditional methods',
      sourceId: 'src3',
      sourceTitle: 'Personalization Impact Analysis',
      credibility: 91,
      category: 'Performance'
    },
    {
      id: '4',
      finding: '85% of marketers report improved ROI after implementing AI-powered analytics tools',
      sourceId: 'src4',
      sourceTitle: 'Marketing ROI Study',
      credibility: 87,
      category: 'ROI Analysis'
    },
    {
      id: '5',
      finding: 'Predictive analytics can reduce customer acquisition costs by 40% through better targeting',
      sourceId: 'src5',
      sourceTitle: 'Customer Acquisition Optimization',
      credibility: 89,
      category: 'Cost Analysis'
    }
  ]);

  const [sources, setSources] = useState([
    {
      id: 'src1',
      title: 'Marketing AI Adoption Report 2024',
      url: 'https://example.com/ai-adoption-2024',
      credibility: 95,
      publishedDate: '2024-03-15',
      author: 'Marketing Tech Institute',
      type: 'Research Report',
      isBookmarked: false,
      category: 'Primary Research'
    },
    {
      id: 'src2',
      title: 'Content Automation Study',
      url: 'https://example.com/content-automation',
      credibility: 88,
      publishedDate: '2024-02-28',
      author: 'Content Marketing Institute',
      type: 'Academic Paper',
      isBookmarked: true,
      category: 'Academic'
    },
    {
      id: 'src3',
      title: 'Personalization Impact Analysis',
      url: 'https://example.com/personalization-analysis',
      credibility: 91,
      publishedDate: '2024-01-20',
      author: 'Harvard Business Review',
      type: 'Industry Analysis',
      isBookmarked: false,
      category: 'Industry'
    },
    {
      id: 'src4',
      title: 'Marketing ROI Study',
      url: 'https://example.com/marketing-roi',
      credibility: 87,
      publishedDate: '2024-02-10',
      author: 'Forrester Research',
      type: 'Market Research',
      isBookmarked: true,
      category: 'Market Research'
    },
    {
      id: 'src5',
      title: 'Customer Acquisition Optimization',
      url: 'https://example.com/customer-acquisition',
      credibility: 89,
      publishedDate: '2024-01-15',
      author: 'McKinsey & Company',
      type: 'Consulting Report',
      isBookmarked: false,
      category: 'Consulting'
    }
  ]);

  const [statistics, setStatistics] = useState([
    {
      id: 'stat1',
      value: '45%',
      description: 'Increase in AI adoption among marketers',
      category: 'Adoption',
      sources: ['src1', 'src4'],
      trend: 'up'
    },
    {
      id: 'stat2',
      value: '80%',
      description: 'Time reduction in content creation with AI tools',
      category: 'Efficiency',
      sources: ['src2'],
      trend: 'up'
    },
    {
      id: 'stat3',
      value: '300%',
      description: 'Higher conversion rates with AI personalization',
      category: 'Performance',
      sources: ['src3'],
      trend: 'up'
    },
    {
      id: 'stat4',
      value: '40%',
      description: 'Reduction in customer acquisition costs',
      category: 'Cost Analysis',
      sources: ['src5'],
      trend: 'down'
    },
    {
      id: 'stat5',
      value: '$2.3M',
      description: 'Average marketing budget allocation to AI tools',
      category: 'Investment',
      sources: ['src1'],
      trend: 'up'
    }
  ]);

  const [trendingTopics, setTrendingTopics] = useState([
    {
      id: 'trend1',
      topic: 'AI-Powered Content Personalization',
      relevance: 95,
      searchVolume: '12K monthly searches',
      growth: '+45%',
      relatedKeywords: ['personalization AI', 'dynamic content', 'customer experience']
    },
    {
      id: 'trend2',
      topic: 'Predictive Analytics in Marketing',
      relevance: 88,
      searchVolume: '8.5K monthly searches',
      growth: '+32%',
      relatedKeywords: ['marketing predictions', 'forecasting AI', 'data-driven marketing']
    },
    {
      id: 'trend3',
      topic: 'Marketing Automation Trends',
      relevance: 82,
      searchVolume: '15K monthly searches',
      growth: '+28%',
      relatedKeywords: ['automation tools', 'workflow optimization', 'marketing efficiency']
    }
  ]);

  const [competitorAnalysis, setCompetitorAnalysis] = useState([
    {
      company: 'Competitor A',
      articleTitle: 'The Ultimate Guide to AI in Marketing',
      publishedDate: '2024-01-10',
      engagement: {
        views: 15000,
        shares: 1200,
        comments: 145
      },
      keywords: ['AI marketing', 'marketing automation', 'digital transformation'],
      gaps: ['Small business focus missing', 'Limited case studies']
    },
    {
      company: 'Competitor B',
      articleTitle: 'How AI is Revolutionizing Content Marketing',
      publishedDate: '2024-01-08',
      engagement: {
        views: 12000,
        shares: 890,
        comments: 98
      },
      keywords: ['content marketing', 'AI writing', 'marketing technology'],
      gaps: ['No ROI analysis', 'Missing implementation guide']
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState([]);

  const toggleBookmark = (sourceId) => {
    setSources(prev => prev.map(source =>
      source.id === sourceId
        ? { ...source, isBookmarked: !source.isBookmarked }
        : source
    ));
  };

  const exportResearch = () => {
    // TODO: Implement PDF export
    console.log('Exporting research...');
  };

  const proceedToWriting = () => {
    router.push('/content/new');
  };

  const getSourceCredibilityColor = (credibility) => {
    if (credibility >= 90) return 'text-accent-green';
    if (credibility >= 75) return 'text-accent-yellow';
    return 'text-red-500';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? (
      <TrendingUp className="w-4 h-4 text-accent-green" />
    ) : (
      <div className="w-4 h-4 text-red-500 transform rotate-180">
        <TrendingUp className="w-4 h-4" />
      </div>
    );
  };

  const filteredSources = sources.filter(source => {
    const matchesSearch = source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || source.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['all', 'Primary Research', 'Academic', 'Industry', 'Market Research', 'Consulting'];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="sticky top-16 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-text-light" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-text-light">Research Results</h1>
                <p className="text-sm text-text-muted">Topic: {researchData.topic}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportResearch}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
              <button
                onClick={proceedToWriting}
                className="flex items-center gap-2 px-4 py-2 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Proceed to Writing
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <Search className="w-8 h-8 text-accent-orange" />
              <span className="text-2xl font-bold text-text-light">{researchData.sourcesFound}</span>
            </div>
            <p className="text-sm text-text-muted">Sources Found</p>
          </div>

          <div className="glass rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-accent-cyan" />
              <span className="text-2xl font-bold text-text-light">{researchData.statisticsCount}</span>
            </div>
            <p className="text-sm text-text-muted">Key Statistics</p>
          </div>

          <div className="glass rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-accent-yellow" />
              <span className="text-2xl font-bold text-text-light">{researchData.overallScore}%</span>
            </div>
            <p className="text-sm text-text-muted">Overall Quality Score</p>
          </div>

          <div className="glass rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-accent-green" />
              <span className="text-2xl font-bold text-text-light">{researchData.credibilityScore}%</span>
            </div>
            <p className="text-sm text-text-muted">Average Credibility</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Findings */}
            <div className="glass rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-text-light mb-6">Key Findings</h2>
              <div className="space-y-4">
                {keyFindings.map((finding) => (
                  <div key={finding.id} className="flex items-start gap-4 p-4 bg-card-bg/10 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-text-light mb-2">{finding.finding}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-text-muted">Source: {finding.sourceTitle}</span>
                        <span className={`font-medium ${getSourceCredibilityColor(finding.credibility)}`}>
                          {finding.credibility}% credible
                        </span>
                        <span className="px-2 py-1 bg-accent-cyan/20 text-accent-cyan rounded text-xs">
                          {finding.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics & Data */}
            <div className="glass rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-text-light mb-6">Statistics & Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statistics.map((stat) => (
                  <div key={stat.id} className="p-4 bg-card-bg/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-accent-orange">{stat.value}</span>
                      {getTrendIcon(stat.trend)}
                    </div>
                    <p className="text-sm text-text-light mb-2">{stat.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted">{stat.category}</span>
                      <span className="text-xs text-accent-cyan">•</span>
                      <span className="text-xs text-text-muted">
                        {stat.sources.length} source{stat.sources.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources List */}
            <div className="glass rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-light">Research Sources</h2>
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search sources..."
                      className="pl-10 pr-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted text-sm w-48"
                    />
                  </div>

                  {/* Filter */}
                  <div className="relative">
                    <button className="flex items-center gap-2 px-3 py-2 bg-card-bg/20 border border-white/20 rounded-lg hover:bg-card-bg/30 transition-colors text-sm">
                      <Filter className="w-4 h-4" />
                      {activeFilter === 'all' ? 'All Categories' : activeFilter}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredSources.map((source) => (
                  <div key={source.id} className="flex items-start justify-between p-4 border border-white/10 rounded-lg hover:bg-card-bg/10 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium text-text-light mb-1">{source.title}</h3>
                      <p className="text-sm text-text-muted mb-2">
                        {source.author} • Published {source.publishedDate}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="px-2 py-1 bg-card-bg/50 rounded text-text-light">{source.type}</span>
                        <span className="px-2 py-1 bg-accent-cyan/20 text-accent-cyan rounded">
                          {source.category}
                        </span>
                        <span className={`font-medium ${getSourceCredibilityColor(source.credibility)}`}>
                          {source.credibility}% credible
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleBookmark(source.id)}
                        className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${source.isBookmarked ? 'text-accent-orange fill-current' : 'text-text-muted'}`}
                        />
                      </button>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-text-muted" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="glass rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-text-light mb-4">Trending Topics</h2>
              <div className="space-y-4">
                {trendingTopics.map((topic) => (
                  <div key={topic.id} className="p-3 bg-card-bg/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-text-light text-sm">{topic.topic}</h3>
                      <span className="text-xs text-accent-green font-medium">{topic.relevance}% relevant</span>
                    </div>
                    <p className="text-xs text-text-muted mb-2">{topic.searchVolume}</p>
                    <p className="text-xs text-accent-orange mb-2">{topic.growth} growth</p>
                    <div className="flex flex-wrap gap-1">
                      {topic.relatedKeywords.slice(0, 2).map((keyword, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-card-bg/50 rounded text-text-muted">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Analysis */}
            <div className="glass rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-text-light mb-4">Competitor Analysis</h2>
              <div className="space-y-4">
                {competitorAnalysis.map((competitor, idx) => (
                  <div key={idx} className="p-3 bg-card-bg/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-accent-cyan text-sm">{competitor.company}</h3>
                      <span className="text-xs text-text-muted">{competitor.publishedDate}</span>
                    </div>
                    <p className="text-sm text-text-light mb-2">{competitor.articleTitle}</p>
                    <div className="flex items-center gap-3 text-xs text-text-muted mb-2">
                      <span>{competitor.engagement.views.toLocaleString()} views</span>
                      <span>{competitor.engagement.shares} shares</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-text-light">Content Gaps:</p>
                      {competitor.gaps.map((gap, gapIdx) => (
                        <span key={gapIdx} className="inline-block text-xs px-2 py-1 bg-accent-orange/20 text-accent-orange rounded mr-1 mb-1">
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="glass rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-bold text-text-light mb-4">Next Steps</h2>
              <div className="space-y-3">
                <button
                  onClick={proceedToWriting}
                  className="w-full px-4 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors"
                >
                  Start Writing Content
                </button>
                <button
                  className="w-full px-4 py-3 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light"
                >
                  Request Additional Research
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}