// components/landing/HowItWorksSection.jsx
'use client';

import { Key, Sliders, Sparkles, Search, Palette, Target, Send, BarChart3 } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Key,
    title: 'Connect Your APIs (Optional)',
    description: 'Add your own API keys for OpenAI, Anthropic, Google, and more to save 80%. Or start with our managed service instantly.',
    color: 'accent-cyan',
    features: ['OpenAI, Anthropic, Google', 'Brave, Tavily, Serper', '80% savings with BYOK']
  },
  {
    number: 2,
    icon: Sliders,
    title: 'Set Provider Priorities',
    description: 'Configure your preferred AI provider order. Automatic fallback ensures zero downtime if one provider fails.',
    color: 'accent-purple',
    features: ['Custom priority order', 'Automatic fallback', 'Zero downtime guarantee']
  },
  {
    number: 3,
    icon: Palette,
    title: 'Define Your Brand Voice',
    description: 'Set your unique tone, style, and messaging guidelines. AI maintains consistency across all content.',
    color: 'accent-orange',
    features: ['Custom tone & style', 'Messaging guidelines', 'Consistent voice']
  },
  {
    number: 4,
    icon: Search,
    title: 'AI Research & Writing',
    description: 'AI agents research your topic using real-time web search, then write SEO-optimized content in your brand voice.',
    color: 'accent-yellow',
    features: ['Real-time research', 'SEO optimization', 'Brand voice writing']
  },
  {
    number: 5,
    icon: Target,
    title: 'Review & Optimize',
    description: 'Review AI-generated content, make edits, and optimize for SEO. Built-in tools help you rank higher.',
    color: 'accent-cyan',
    features: ['Content editor', 'SEO analysis', 'Keyword optimization']
  },
  {
    number: 6,
    icon: Send,
    title: 'Multi-Platform Publishing',
    description: 'Publish to WordPress, Medium, LinkedIn, Twitter, and more. Schedule posts for optimal engagement times.',
    color: 'accent-purple',
    features: ['10+ platforms', 'Auto-scheduling', 'Optimal timing']
  },
  {
    number: 7,
    icon: BarChart3,
    title: 'Track Performance',
    description: 'Monitor engagement, traffic, and ROI. Understand what works and optimize your content strategy.',
    color: 'accent-green',
    features: ['Real-time analytics', 'Engagement metrics', 'ROI tracking']
  }
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-20 bg-dark-bg">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent-purple/10 border border-accent-purple/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span className="text-sm font-medium text-accent-purple">Simple 7-Step Process</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            How It
            <span className="gradient-text"> Works</span>
          </h2>

          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            From setup to publishing, our AI-powered platform handles everything.
            Get started in minutes and create amazing content in hours, not days.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-cyan via-accent-purple to-accent-green opacity-30" />

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative flex items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    } flex-col gap-8`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'lg:text-right' : 'lg:text-left'} text-center`}>
                    <div className={`glass rounded-2xl p-8 border border-white/10 hover:border-${step.color}/50 transition-all`}>
                      <div className={`inline-flex items-center gap-3 mb-4 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                        <div className={`w-12 h-12 rounded-lg bg-${step.color}/10 border border-${step.color}/30 flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 text-${step.color}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-text-light">{step.title}</h3>
                      </div>

                      <p className="text-text-muted mb-6 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Features */}
                      <div className={`flex flex-wrap gap-2 ${isEven ? 'lg:justify-end' : 'lg:justify-start'} justify-center`}>
                        {step.features.map((feature, i) => (
                          <span
                            key={i}
                            className="text-xs bg-card-bg/40 border border-white/10 rounded-full px-3 py-1 text-text-muted"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step Number Circle */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-${step.color} to-${step.color}/50 flex items-center justify-center border-4 border-dark-bg shadow-lg shadow-${step.color}/30`}>
                      <span className="text-3xl font-bold text-dark-bg">{step.number}</span>
                    </div>
                  </div>

                  {/* Spacer for alignment */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-text-muted mb-6">
            Ready to transform your content creation process?
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-orange to-accent-yellow hover:opacity-90 text-dark-bg px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Start Your Free Trial
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}