// components/landing/HowItWorksSection.tsx
'use client';

import { MessageSquare, Search, PenTool, Image, Send, CheckCircle } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: MessageSquare,
      title: 'Enter Your Topic',
      description: 'Simply tell us what you want to create content about. Our AI understands context and intent.',
      color: 'accent-cyan',
      delay: '0s',
    },
    {
      number: '02',
      icon: Search,
      title: 'AI Researches',
      description: 'Research agent gathers information from trusted sources, statistics, and trending data.',
      color: 'accent-yellow',
      delay: '0.2s',
    },
    {
      number: '03',
      icon: PenTool,
      title: 'Content Generated',
      description: 'Writing agent creates high-quality, SEO-optimized content in your brand voice.',
      color: 'accent-cyan',
      delay: '0.4s',
    },
    {
      number: '04',
      icon: Image,
      title: 'Images Created',
      description: 'Image agent generates or finds perfect visuals to complement your content.',
      color: 'accent-orange',
      delay: '0.6s',
    },
    {
      number: '05',
      icon: Send,
      title: 'Multi-Platform Publishing',
      description: 'Publish to WordPress, Twitter, Medium, LinkedIn and more with one click.',
      color: 'accent-green',
      delay: '0.8s',
    },
    {
      number: '06',
      icon: CheckCircle,
      title: 'Track Performance',
      description: 'Monitor engagement, views, and conversions across all platforms in real-time.',
      color: 'accent-orange',
      delay: '1s',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-bg to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            How It <span className="text-accent-orange">Works</span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            From idea to published content in 6 simple steps
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-cyan via-accent-yellow to-accent-orange opacity-30" />

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                {...step}
                isEven={index % 2 === 0}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <button className="bg-accent-orange hover:bg-opacity-90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent-orange/30">
            Start Your Free Trial
          </button>
          <p className="mt-4 text-text-muted">
            Create your first content piece in under 10 minutes
          </p>
        </div>
      </div>
    </section>
  );
}


function StepCard({ number, icon: Icon, title, description, color, delay, isEven }) {
  const colorClasses = {
    'accent-cyan': {
      text: 'text-accent-cyan',
      bg: 'bg-accent-cyan',
      border: 'border-accent-cyan',
    },
    'accent-yellow': {
      text: 'text-accent-yellow',
      bg: 'bg-accent-yellow',
      border: 'border-accent-yellow',
    },
    'accent-orange': {
      text: 'text-accent-orange',
      bg: 'bg-accent-orange',
      border: 'border-accent-orange',
    },
    'accent-green': {
      text: 'text-accent-green',
      bg: 'bg-accent-green',
      border: 'border-accent-green',
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`relative flex flex-col lg:flex-row items-center gap-8 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
      style={{ animationDelay: delay }}
    >
      {/* Content */}
      <div className={`flex-1 ${isEven ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
        <div className="inline-block">
          <span className={`text-6xl font-bold ${colors.text} opacity-20`}>
            {number}
          </span>
          <h3 className="text-2xl font-bold mb-3 mt-2">{title}</h3>
          <p className="text-text-muted text-lg leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>

      {/* Center Icon */}
      <div className="relative z-10">
        <div className={`w-20 h-20 rounded-full ${colors.bg} bg-opacity-20 border-4 ${colors.border} flex items-center justify-center backdrop-blur-sm`}>
          <Icon className={`w-10 h-10 ${colors.text}`} />
        </div>
        {/* Pulse effect */}
        <div className={`absolute inset-0 rounded-full ${colors.bg} opacity-20 animate-ping`} />
      </div>

      {/* Spacer for even layout */}
      <div className="flex-1 hidden lg:block" />
    </div>
  );
}