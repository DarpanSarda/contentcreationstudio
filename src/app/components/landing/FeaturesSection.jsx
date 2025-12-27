// components/landing/FeaturesSection.jsx
'use client';

import {
  Zap, Search, Palette, Target, TrendingDown, Shield,
  BarChart3, Users, Calendar, Globe, Code, Sparkles,
  RefreshCw, Layers, Lock, Workflow
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Multi-LLM Support',
    description: 'Access OpenAI, Anthropic, Google Gemini, DeepSeek, and more. Smart priority and automatic fallback ensure zero downtime.',
    color: 'accent-yellow',
    benefits: ['5+ AI providers', 'Smart fallback', 'Zero downtime']
  },
  {
    icon: Search,
    title: 'Real-Time Web Research',
    description: 'AI agents research topics using Brave Search, Tavily, and Serper to gather the latest information and data.',
    color: 'accent-cyan',
    benefits: ['Live data', 'Multiple sources', 'Fact-checked']
  },
  {
    icon: Palette,
    title: 'Custom Brand Voice',
    description: 'Define your unique tone, style, and messaging. AI maintains consistency across all content pieces.',
    color: 'accent-purple',
    benefits: ['Tone control', 'Style guide', 'Consistency']
  },
  {
    icon: Target,
    title: 'SEO Optimization',
    description: 'Built-in SEO analysis and optimization. Rank higher on search engines with keyword-rich, structured content.',
    color: 'accent-orange',
    benefits: ['Keyword research', 'Meta tags', 'Rankings boost']
  },
  {
    icon: TrendingDown,
    title: 'BYOK Pricing',
    description: 'Bring Your Own API Keys and save 80% on subscription costs. Full transparency and control over your AI usage.',
    color: 'accent-green',
    benefits: ['80% savings', 'Full control', 'Transparent costs']
  },
  {
    icon: RefreshCw,
    title: 'Priority & Fallback System',
    description: 'Set provider priority order. Automatic failover ensures your workflow never stops, even if one provider is down.',
    color: 'accent-cyan',
    benefits: ['Custom priority', 'Auto failover', 'Reliability']
  },
  {
    icon: Globe,
    title: 'Multi-Platform Publishing',
    description: 'Publish to WordPress, Medium, LinkedIn, Twitter, and more. Schedule posts and manage all platforms from one dashboard.',
    color: 'accent-orange',
    benefits: ['10+ platforms', 'Auto-publish', 'Scheduling']
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track performance, engagement, and ROI. Understand what content works and optimize your strategy.',
    color: 'accent-purple',
    benefits: ['Real-time metrics', 'Insights', 'ROI tracking']
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite team members, assign roles, and collaborate on content. Review, approve, and publish together.',
    color: 'accent-cyan',
    benefits: ['Team workspace', 'Role management', 'Workflows']
  },
  {
    icon: Calendar,
    title: 'Content Scheduling',
    description: 'Plan your content calendar weeks in advance. Auto-publish at optimal times for maximum engagement.',
    color: 'accent-yellow',
    benefits: ['Calendar view', 'Auto-publish', 'Optimal timing']
  },
  {
    icon: Code,
    title: 'API Access',
    description: 'Full API access for custom integrations. Build your own tools and workflows on top of our platform.',
    color: 'accent-purple',
    benefits: ['REST API', 'Webhooks', 'Custom integrations']
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-level encryption, SOC 2 compliance, and data privacy. Your content and API keys are always secure.',
    color: 'accent-green',
    benefits: ['AES-256', 'SOC 2', 'Data privacy']
  },
  {
    icon: Sparkles,
    title: 'AI Content Generation',
    description: 'Generate blog posts, social media content, emails, and more. AI writes in your brand voice with perfect grammar.',
    color: 'accent-orange',
    benefits: ['Multiple formats', 'Brand voice', 'Grammar check']
  },
  {
    icon: Layers,
    title: 'Content Templates',
    description: 'Pre-built templates for blogs, social posts, emails, and ads. Customize and reuse for faster content creation.',
    color: 'accent-cyan',
    benefits: ['50+ templates', 'Customizable', 'Reusable']
  },
  {
    icon: Workflow,
    title: 'Automated Workflows',
    description: 'Set up automated content pipelines. From research to publishing, let AI handle the entire process.',
    color: 'accent-purple',
    benefits: ['Full automation', 'Custom workflows', 'Time-saving']
  },
  {
    icon: Shield,
    title: 'Content Moderation',
    description: 'AI-powered content review ensures brand safety. Detect and prevent inappropriate or off-brand content.',
    color: 'accent-yellow',
    benefits: ['Brand safety', 'Auto-review', 'Compliance']
  }
];

export default function FeaturesSection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-dark-bg to-card-bg/20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span className="text-sm font-medium text-accent-cyan">Complete Content Creation Platform</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="gradient-text"> Create Amazing Content</span>
          </h2>

          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            From AI-powered research and writing to multi-platform publishing and analytics.
            All the tools you need in one powerful platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group glass rounded-xl p-6 border border-white/10 hover:border-accent-cyan/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent-cyan/10"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 border border-${feature.color}/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 text-${feature.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-text-light mb-2 group-hover:text-accent-cyan transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-muted mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap gap-2">
                  {feature.benefits.map((benefit, i) => (
                    <span
                      key={i}
                      className="text-xs bg-card-bg/40 border border-white/10 rounded-full px-2 py-1 text-text-muted"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-text-muted mb-6">
            And many more features to help you create better content faster
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Start Creating for Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}