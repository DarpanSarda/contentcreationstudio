// app/content/[id]/edit/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Edit,
  RefreshCw,
  Download,
  Share2,
  Image,
  FileText,
  Hash,
  Target,
  Mail,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Search,
  Sparkles,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo2,
  Redo2,
  Plus
} from 'lucide-react';

export default function ContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState({
    id: params.id,
    title: '10 AI Tools That Will Transform Your Marketing in 2025',
    type: 'Blog Post',
    status: 'draft',
    platforms: ['WordPress', 'Medium'],
    tone: 'professional',
    targetAudience: 'Marketing professionals and business owners',
    keywords: ['AI marketing', 'marketing automation', 'digital marketing', 'AI tools'],
    created: '2024-01-15',
    updated: '2024-01-15',
    lastSaved: '2024-01-15T10:30:00Z'
  });

  const [editorContent, setEditorContent] = useState(`# 10 AI Tools That Will Transform Your Marketing in 2025

The marketing landscape is evolving at an unprecedented pace, and artificial intelligence is at the forefront of this transformation. As we navigate through 2025, businesses that leverage AI-powered marketing tools are gaining a significant competitive advantage.

## Why AI Marketing Tools Matter

AI marketing tools are no longer a luxury—they're essential for staying competitive in today's digital landscape. These tools help marketers:

- Automate repetitive tasks and save valuable time
- Analyze vast amounts of data for actionable insights
- Personalize customer experiences at scale
- Optimize campaigns in real-time
- Generate creative content and ideas

## Top AI Marketing Tools for 2025

### 1. Content Generation Platforms

Advanced AI content platforms can now generate blog posts, social media updates, and email newsletters that match your brand voice perfectly. These tools use sophisticated language models to understand context and produce high-quality, engaging content.

### 2. Predictive Analytics Solutions

Predictive analytics tools analyze historical data to forecast future trends, customer behavior, and campaign performance. This helps marketers make data-driven decisions and allocate resources more effectively.

### 3. Personalization Engines

AI-powered personalization engines deliver tailored experiences to each user based on their behavior, preferences, and purchase history. This level of personalization significantly increases conversion rates and customer satisfaction.

### 4. Chatbot and Conversational AI

Modern chatbots can handle complex customer queries, provide personalized recommendations, and even complete transactions. They're available 24/7 and can handle multiple conversations simultaneously.

## Implementing AI Tools in Your Marketing Strategy

When integrating AI tools into your marketing strategy, consider the following:

1. **Start Small**: Begin with one or two tools that address your most pressing needs
2. **Train Your Team**: Ensure your marketing team understands how to use these tools effectively
3. **Measure Results**: Track key metrics to evaluate the impact of AI tools on your marketing efforts
4. **Stay Updated**: The AI landscape is constantly evolving—keep learning about new tools and features

## The Future of AI in Marketing

As we look ahead, AI will continue to reshape the marketing industry. We can expect more sophisticated tools that offer deeper insights, better automation, and more creative capabilities. Marketers who embrace these technologies will thrive in the years to come.

## Conclusion

AI marketing tools are transforming how businesses connect with their customers and optimize their marketing efforts. By staying informed about the latest tools and trends, you can ensure your marketing strategy remains cutting-edge and effective in 2025 and beyond.

The key is to start implementing these tools strategically, measure their impact, and continuously adapt your approach as technology evolves. The future of marketing is here—are you ready to embrace it?`);

  const [researchSources, setResearchSources] = useState([
    {
      id: '1',
      title: 'The State of AI in Marketing 2024 Report',
      url: 'https://example.com/ai-marketing-report-2024',
      credibility: 95,
      summary: 'Comprehensive analysis of AI adoption in marketing across industries...',
      used: true
    },
    {
      id: '2',
      title: 'Machine Learning for Customer Segmentation',
      url: 'https://example.com/ml-customer-segmentation',
      credibility: 88,
      summary: 'How machine learning algorithms are improving customer segmentation...',
      used: false
    },
    {
      id: '3',
      title: 'Content Generation with GPT-4 and Beyond',
      url: 'https://example.com/content-generation-gpt4',
      credibility: 92,
      summary: 'Latest developments in AI content generation technologies...',
      used: true
    }
  ]);

  const [generatedImages, setGeneratedImages] = useState([
    {
      id: '1',
      url: '/api/placeholder/300/200',
      prompt: 'AI marketing dashboard with graphs and analytics',
      style: 'professional'
    },
    {
      id: '2',
      url: '/api/placeholder/300/200',
      prompt: 'Team collaboration around digital marketing campaign',
      style: 'modern'
    }
  ]);

  const [wordCount, setWordCount] = useState(editorContent.split(/\s+/).length);
  const [readabilityScore, setReadabilityScore] = useState(78);
  const [seoScore, setSeoScore] = useState(85);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [suggestions, setSuggestions] = useState([
    'Add more statistics to support your claims',
    'Consider including a case study example',
    'Break up the long paragraphs for better readability',
    'Add relevant internal links to your content'
  ]);

  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      setSelectedText(selection.toString());
    };

    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, []);

  useEffect(() => {
    setWordCount(editorContent.split(/\s+/).length);
  }, [editorContent]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate auto-save
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContent(prev => ({
        ...prev,
        updated: new Date().toISOString().split('T')[0],
        lastSaved: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/publishing');
    } catch (error) {
      console.error('Publish error:', error);
    }
  };

  const regenerateSection = async () => {
    if (!selectedText) return;

    try {
      // Simulate AI regeneration
      await new Promise(resolve => setTimeout(resolve, 1500));
      // TODO: Replace selected text with AI-generated content
    } catch (error) {
      console.error('Regeneration error:', error);
    }
  };

  const improveWithAI = async (prompt) => {
    if (!selectedText) return;

    try {
      // Simulate AI improvement
      await new Promise(resolve => setTimeout(resolve, 1500));
      // TODO: Apply AI improvement to selected text
    } catch (error) {
      console.error('AI improvement error:', error);
    }
  };

  const insertImage = (imageUrl) => {
    const imageMarkdown = `![Image](${imageUrl})`;
    setEditorContent(prev => prev + '\n\n' + imageMarkdown + '\n\n');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'scheduled': return 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30';
      case 'draft': return 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30';
      default: return 'bg-card-bg/20 text-text-muted border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-16 z-40 glass border-b border-white/10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Link
                href="/content"
                className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-text-light" />
              </Link>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg font-semibold bg-transparent text-text-light placeholder-text-muted outline-none w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(content.status)}`}>
                {content.status}
              </span>

              {/* Last Saved */}
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Saved {new Date(content.lastSaved).toLocaleTimeString()}</span>
              </div>

              {/* Actions */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-text-light border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Save</span>
              </button>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>

              <button
                onClick={handlePublish}
                className="flex items-center gap-2 px-4 py-2 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Publish</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="glass border-b border-white/10 p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 border-r border-white/10 pr-2">
                <button className="p-2 hover:bg-card-bg/20 rounded transition-colors">
                  <Undo2 className="w-4 h-4 text-text-light" />
                </button>
                <button className="p-2 hover:bg-card-bg/20 rounded transition-colors">
                  <Redo2 className="w-4 h-4 text-text-light" />
                </button>
              </div>

              <div className="flex items-center gap-1 border-r border-white/10 pr-2">
                <button className="p-2 hover:bg-card-bg/20 rounded transition-colors">
                  <Bold className="w-4 h-4 text-text-light" />
                </button>
                <button className="p-2 hover:bg-card-bg/20 rounded transition-colors">
                  <Italic className="w-4 h-4 text-text-light" />
                </button>
                <button className="p-2 hover:bg-card-bg/20 rounded transition-colors">
                  <Underline className="w-4 h-4 text-text-light" />
                </button>
              </div>

              <div className="flex items-center gap-1 border-r border-white/10 pr-2">
                <button className="p-2 hover:bg-card-bg/20 rounded transition-colors">
                  <List className="w-4 h-4 text-text-light" />
                </button>
                <button className="p-2 hover:bg-card-bg/20 rounded transition-colors">
                  <ListOrdered className="w-4 h-4 text-text-light" />
                </button>
                <button className="p-2 hover:bg-card-bg/20 rounded transition-colors">
                  <Quote className="w-4 h-4 text-text-light" />
                </button>
                <button className="p-2 hover:bg-card-bg/20 rounded transition-colors">
                  <Code className="w-4 h-4 text-text-light" />
                </button>
              </div>

              <div className="flex items-center gap-1 border-r border-white/10 pr-2">
                <button className="p-2 hover:bg-card-bg/20 rounded transition-colors">
                  <Link className="w-4 h-4 text-text-light" />
                </button>
                <button className="p-2 hover:bg-card-bg/20 rounded transition-colors">
                  <Image className="w-4 h-4 text-text-light" />
                </button>
              </div>

              {/* AI Actions */}
              <div className="flex items-center gap-1">
                {selectedText && (
                  <>
                    <button
                      onClick={regenerateSection}
                      className="flex items-center gap-1 px-3 py-2 bg-accent-cyan/20 text-accent-cyan rounded-lg hover:bg-accent-cyan/30 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Regenerate
                    </button>
                    <div className="relative group">
                      <button className="flex items-center gap-1 px-3 py-2 bg-accent-orange/20 text-accent-orange rounded-lg hover:bg-accent-orange/30 transition-colors">
                        <Sparkles className="w-3 h-3" />
                        Improve
                      </button>
                      <div className="absolute bottom-full left-0 mb-2 w-48 glass border border-white/10 rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        {['Make it shorter', 'Make it more professional', 'Add statistics', 'Simplify language'].map((action) => (
                          <button
                            key={action}
                            onClick={() => improveWithAI(action)}
                            className="w-full text-left px-2 py-1 text-sm text-text-light hover:bg-card-bg/20 rounded transition-colors"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col">
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="flex-1 w-full p-6 bg-dark-bg text-text-light placeholder-text-muted resize-none outline-none font-mono text-sm leading-relaxed"
                placeholder="Start writing your content..."
              />

              {/* Bottom Stats */}
              <div className="glass border-t border-white/10 p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-text-muted" />
                      <span className="text-text-muted">Words:</span>
                      <span className="text-text-light font-medium">{wordCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-text-muted" />
                      <span className="text-text-muted">Readability:</span>
                      <span className={`font-medium ${readabilityScore >= 80 ? 'text-accent-green' : readabilityScore >= 60 ? 'text-accent-yellow' : 'text-red-500'}`}>
                        {readabilityScore}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-text-muted" />
                      <span className="text-text-muted">SEO:</span>
                      <span className={`font-medium ${seoScore >= 80 ? 'text-accent-green' : seoScore >= 60 ? 'text-accent-yellow' : 'text-red-500'}`}>
                        {seoScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 glass border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 mb-4">
              {getTypeIcon(content.type)}
              <span className="font-medium text-text-light">{content.type}</span>
            </div>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-text-muted">Platforms:</span>
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
              </div>
              <div>
                <span className="text-text-muted">Audience:</span>
                <p className="text-text-light mt-1">{content.targetAudience}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10">
            <div className="flex">
              {['research', 'images', 'suggestions', 'seo'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-accent-cyan border-b-2 border-accent-cyan'
                      : 'text-text-muted hover:text-text-light'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'research' && (
              <div className="space-y-4">
                <h3 className="font-medium text-text-light">Research Sources</h3>
                {researchSources.map((source) => (
                  <div
                    key={source.id}
                    className={`p-3 border rounded-lg ${
                      source.used ? 'border-accent-green/30 bg-accent-green/10' : 'border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-text-light line-clamp-2">
                        {source.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        source.used ? 'bg-accent-green/20 text-accent-green' : 'bg-card-bg/50 text-text-muted'
                      }`}>
                        {source.used ? 'Used' : 'Available'}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mb-2 line-clamp-2">
                      {source.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        Credibility: {source.credibility}%
                      </span>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent-cyan hover:text-accent-cyan/80"
                      >
                        View Source
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-4">
                <h3 className="font-medium text-text-light">Generated Images</h3>
                {generatedImages.map((image) => (
                  <div key={image.id} className="space-y-2">
                    <div className="aspect-video bg-card-bg/20 rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-8 h-8 text-text-muted" />
                      </div>
                    </div>
                    <p className="text-xs text-text-muted">{image.prompt}</p>
                    <button
                      onClick={() => insertImage(image.url)}
                      className="w-full px-3 py-2 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded text-sm font-medium transition-colors"
                    >
                      Insert into Content
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-4">
                <h3 className="font-medium text-text-light">AI Suggestions</h3>
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-3 bg-card-bg/20 border border-white/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-accent-yellow flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-text-light">{suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-4">
                <h3 className="font-medium text-text-light">SEO Recommendations</h3>
                <div className="space-y-3">
                  {content.keywords.map((keyword, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-text-light">{keyword}</span>
                      <span className="text-xs text-accent-green">Used {idx + 1} times</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-accent-green/20 border border-accent-green/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-accent-green" />
                    <span className="text-sm font-medium text-accent-green">Good SEO Score</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Your content is well-optimized for search engines with proper keyword density and structure.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}