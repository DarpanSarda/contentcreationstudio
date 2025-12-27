// components/landing/StatsSection.jsx
'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, FileText, Zap, Clock, DollarSign, Globe, BarChart3 } from 'lucide-react';

const stats = [
  {
    icon: FileText,
    value: '500K+',
    label: 'Content Pieces Generated',
    color: 'accent-cyan',
    suffix: ''
  },
  {
    icon: Users,
    value: '10K+',
    label: 'Active Users',
    color: 'accent-purple',
    suffix: ''
  },
  {
    icon: Zap,
    value: '50M+',
    label: 'API Calls Processed',
    color: 'accent-yellow',
    suffix: ''
  },
  {
    icon: Clock,
    value: '10',
    label: 'Average Time Saved',
    color: 'accent-orange',
    suffix: 'x'
  },
  {
    icon: DollarSign,
    value: '80',
    label: 'Savings with BYOK',
    color: 'accent-green',
    suffix: '%'
  },
  {
    icon: Globe,
    value: '15+',
    label: 'Platforms Supported',
    color: 'accent-cyan',
    suffix: ''
  },
  {
    icon: TrendingUp,
    value: '300',
    label: 'Average Traffic Increase',
    color: 'accent-purple',
    suffix: '%'
  },
  {
    icon: BarChart3,
    value: '99.9',
    label: 'Uptime Guarantee',
    color: 'accent-green',
    suffix: '%'
  }
];

function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        // Parse the end value to handle numbers with K, M suffixes
        let numericEnd = parseFloat(end.replace(/[KM+%x]/g, ''));
        setCount(Math.floor(numericEnd * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('stats-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="relative py-20 bg-gradient-to-b from-card-bg/20 to-dark-bg">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-accent-cyan" />
            <span className="text-sm font-medium text-accent-cyan">Trusted by Thousands</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Platform
            <span className="gradient-text"> Statistics</span>
          </h2>

          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Join thousands of content creators, marketers, and businesses who are creating better content faster with our AI-powered platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="glass rounded-xl p-6 border border-white/10 hover:border-accent-cyan/50 transition-all hover:scale-105 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}/10 border border-${stat.color}/30 flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} />
                </div>

                {/* Value */}
                <div className={`text-4xl font-bold text-${stat.color} mb-2`}>
                  {isVisible ? (
                    <>
                      {stat.value}
                      {stat.suffix && <span className="text-2xl">{stat.suffix}</span>}
                    </>
                  ) : (
                    '0'
                  )}
                </div>

                {/* Label */}
                <div className="text-sm text-text-muted font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Stats Bar */}
        <div className="mt-16 glass rounded-2xl p-8 border border-white/10">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-accent-cyan mb-2">5+</div>
              <div className="text-sm text-text-muted">LLM Providers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-purple mb-2">3+</div>
              <div className="text-sm text-text-muted">Search Engines</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-orange mb-2">15+</div>
              <div className="text-sm text-text-muted">Publishing Platforms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-green mb-2">24/7</div>
              <div className="text-sm text-text-muted">Support Available</div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <p className="text-text-muted mb-6">
            Trusted by content creators, marketers, and businesses worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-50">
            {/* Placeholder for company logos */}
            <div className="w-32 h-12 bg-card-bg/20 rounded-lg flex items-center justify-center">
              <span className="text-xs text-text-muted">Company Logo</span>
            </div>
            <div className="w-32 h-12 bg-card-bg/20 rounded-lg flex items-center justify-center">
              <span className="text-xs text-text-muted">Company Logo</span>
            </div>
            <div className="w-32 h-12 bg-card-bg/20 rounded-lg flex items-center justify-center">
              <span className="text-xs text-text-muted">Company Logo</span>
            </div>
            <div className="w-32 h-12 bg-card-bg/20 rounded-lg flex items-center justify-center">
              <span className="text-xs text-text-muted">Company Logo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}