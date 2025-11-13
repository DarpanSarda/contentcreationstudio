// app/help/page.jsx
'use client';

import Link from 'next/link';
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  Search,
  Clock,
  FileText,
  Video,
  Download,
  ChevronRight,
  Users,
  Zap,
  Shield,
  Target
} from 'lucide-react';

export default function HelpCenter() {
  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Zap className="w-6 h-6" />,
      color: 'accent-cyan',
      description: 'New to ContentStudio? Start here!',
      articles: [
        { title: 'Quick Start Guide', description: 'Create your first content piece in 5 minutes', time: '5 min read' },
        { title: 'Understanding AI Agents', description: 'Learn how our AI agents work together', time: '3 min read' },
        { title: 'Setting Up Your Profile', description: 'Configure your preferences and settings', time: '2 min read' },
        { title: 'Connecting Platforms', description: 'Connect WordPress, Twitter, and more', time: '4 min read' }
      ]
    },
    {
      id: 'content-creation',
      title: 'Content Creation',
      icon: <FileText className="w-6 h-6" />,
      color: 'accent-orange',
      description: 'Learn to create amazing content',
      articles: [
        { title: 'Writing Blog Posts', description: 'Step-by-step guide to creating blog content', time: '6 min read' },
        { title: 'Social Media Automation', description: 'Automate your social media posting', time: '5 min read' },
        { title: 'Email Newsletter Creation', description: 'Create engaging email campaigns', time: '4 min read' },
        { title: 'Content Templates', description: 'Use and create custom templates', time: '3 min read' }
      ]
    },
    {
      id: 'research-automation',
      title: 'Research & AI Tools',
      icon: <Target className="w-6 h-6" />,
      color: 'accent-yellow',
      description: 'Master our AI-powered features',
      articles: [
        { title: 'AI Research Best Practices', description: 'Get the most from our research agent', time: '5 min read' },
        { title: 'Customizing AI Content', description: 'Fine-tune generated content to your style', time: '4 min read' },
        { title: 'Research Agent Configuration', description: 'Optimize research depth and sources', time: '3 min read' },
        { title: 'Content Quality Control', description: 'Review and improve AI-generated content', time: '4 min read' }
      ]
    },
    {
      id: 'platform-integration',
      title: 'Platform Integration',
      icon: <ExternalLink className="w-6 h-6" />,
      color: 'accent-green',
      description: 'Connect with your favorite platforms',
      articles: [
        { title: 'WordPress Integration', description: 'Complete WordPress setup guide', time: '7 min read' },
        { title: 'Social Media Platforms', description: 'Connect Twitter, LinkedIn, Instagram', time: '6 min read' },
        { title: 'Email Marketing Tools', description: 'Integration with Mailchimp, ConvertKit', time: '5 min read' },
        { title: 'API Documentation', description: 'Build custom integrations with our API', time: '10 min read' }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <Shield className="w-6 h-6" />,
      color: 'purple-500',
      description: 'Solve common issues quickly',
      articles: [
        { title: 'Common Login Issues', description: 'Fix authentication problems', time: '2 min read' },
        { title: 'Content Publishing Errors', description: 'Troubleshoot publishing failures', time: '3 min read' },
        { title: 'AI Agent Not Responding', description: 'Diagnose agent issues', time: '4 min read' },
        { title: 'Slow Performance Tips', description: 'Optimize your workflow speed', time: '5 min read' }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Features',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'pink-500',
      description: 'Master advanced functionality',
      articles: [
        { title: 'Workflow Automation', description: 'Create complex multi-step workflows', time: '8 min read' },
        { title: 'Content Scheduling', description: 'Advanced scheduling and queue management', time: '6 min read' },
        { title: 'Analytics & Reporting', description: 'Deep dive into content performance', time: '7 min read' },
        { title: 'API Key Management', description: 'Secure API key setup and usage', time: '4 min read' }
      ]
    }
  ];

  const popularArticles = [
    {
      title: 'How to Create Your First Blog Post',
      category: 'Getting Started',
      time: '5 min read',
      views: 1234
    },
    {
      title: 'Understanding AI Content Quality',
      category: 'Content Creation',
      time: '4 min read',
      views: 856
    },
    {
      title: 'WordPress Integration Guide',
      category: 'Platform Integration',
      time: '7 min read',
      views: 743
    }
  ];

  const quickLinks = [
    { title: 'API Documentation', href: '/docs/api', icon: <BookOpen className="w-4 h-4" /> },
    { title: 'Video Tutorials', href: '/tutorials', icon: <Video className="w-4 h-4" /> },
    { title: 'Community Forum', href: '/community', icon: <Users className="w-4 h-4" /> },
    { title: 'Contact Support', href: '/support', icon: <MessageCircle className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="sticky top-16 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-text-light">Help Center</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="pl-10 pr-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all w-64"
                />
              </div>

              {/* Contact Support Button */}
              <Link
                href="/support"
                className="flex items-center gap-2 px-4 py-2 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="glass rounded-xl border border-white/10 p-8 mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-cyan to-accent-orange rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-text-light mb-4">How can we help you?</h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto mb-8">
            Find answers to common questions, learn best practices, and get the most out of ContentStudio.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-orange mb-1">200+</p>
              <p className="text-sm text-text-muted">Help Articles</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-cyan mb-1">95%</p>
              <p className="text-sm text-text-muted">Issues Resolved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-green mb-1">24h</p>
              <p className="text-sm text-text-muted">Support Response</p>
            </div>
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-text-light mb-4">Popular Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularArticles.map((article, index) => (
              <Link
                key={index}
                href={`/help/article/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="block p-6 border border-white/10 rounded-lg hover:bg-card-bg/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="px-3 py-1 bg-accent-orange/20 text-accent-orange rounded text-xs font-medium">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Clock className="w-3 h-3" />
                    {article.time}
                  </div>
                </div>
                <h4 className="font-medium text-text-light mb-2 group-hover:text-accent-cyan transition-colors">
                  {article.title}
                </h4>
                <p className="text-xs text-text-muted">Viewed {article.views.toLocaleString()} times</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCategories.map((category) => (
            <Link
              key={category.id}
              href={`/help/category/${category.id}`}
              className="block glass rounded-xl border border-white/10 p-6 hover:border-accent-cyan/50 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 ${category.color}/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-light group-hover:text-accent-cyan transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-text-muted">{category.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted group-hover:translate-x-1 transition-transform" />
              </div>

              <div className="space-y-2">
                {category.articles.slice(0, 3).map((article, index) => (
                  <Link
                    key={index}
                    href={`/help/article/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block p-3 bg-card-bg/10 rounded hover:bg-card-bg/20 transition-colors"
                  >
                    <p className="text-sm text-text-light mb-1">{article.title}</p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Clock className="w-3 h-3" />
                      {article.time}
                    </div>
                  </Link>
                ))}
                {category.articles.length > 3 && (
                  <button className="w-full text-center text-sm text-accent-cyan hover:text-accent-cyan/80 font-medium py-2">
                    View all {category.articles.length} articles
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="glass rounded-xl border border-white/10 p-8">
          <h3 className="text-xl font-bold text-text-light mb-6">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center gap-3 p-4 border border-white/10 rounded-lg hover:bg-card-bg/10 hover:border-accent-cyan/50 transition-all group"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-card-bg/20 rounded-lg group-hover:bg-accent-cyan/20 transition-colors">
                  {link.icon}
                </div>
                <span className="text-sm font-medium text-text-light group-hover:text-accent-cyan transition-colors">
                  {link.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Support CTA */}
        <div className="glass rounded-xl border border-white/10 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-text-light mb-4">Still need help?</h3>
          <p className="text-lg text-text-muted mb-6 max-w-2xl mx-auto">
            Our support team is here to help you succeed with ContentStudio. Get in touch with us through multiple channels.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/support"
              className="flex items-center gap-2 px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Submit Ticket
            </Link>

            <Link
              href="mailto:support@contentstudio.com"
              className="flex items-center gap-2 px-6 py-3 border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan/20 rounded-lg font-medium transition-all"
            >
              <Mail className="w-5 h-5" />
              Email Support
            </Link>

            <a
              href="tel:+1-800-CONTENT"
              className="flex items-center gap-2 px-6 py-3 border-2 border-white/20 text-text-light hover:bg-card-bg/20 rounded-lg font-medium transition-all"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
          </div>

          <div className="mt-6 text-sm text-text-muted">
            <p>Available: Monday-Friday, 9 AM - 6 PM EST</p>
            <p>Weekend: Emergency support only</p>
          </div>
        </div>
      </main>
    </div>
  );
}