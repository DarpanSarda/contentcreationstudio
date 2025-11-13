// components/landing/StatsSection.tsx
'use client';

import { TrendingUp, Users, FileText, Clock } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      icon: FileText,
      value: '10K+',
      label: 'Content Pieces Created',
      color: 'accent-yellow',
    },
    {
      icon: Users,
      value: '2K+',
      label: 'Active Creators',
      color: 'accent-cyan',
    },
    {
      icon: Clock,
      value: '15min',
      label: 'Average Creation Time',
      color: 'accent-orange',
    },
    {
      icon: TrendingUp,
      value: '95%',
      label: 'Client Satisfaction',
      color: 'accent-green',
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-dark-bg">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-orange/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Trusted by <span className="text-accent-orange">Thousands</span>
          </h2>
          <p className="text-xl text-text-muted">
            Join the content creators who've automated their workflow
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-20 text-center">
          <p className="text-text-muted mb-8">As featured in</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            <div className="text-2xl font-bold">TechCrunch</div>
            <div className="text-2xl font-bold">Forbes</div>
            <div className="text-2xl font-bold">Wired</div>
            <div className="text-2xl font-bold">VentureBeat</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, value, label, color, delay }) {
  const colorClasses = {
    'accent-cyan': {
      text: 'text-accent-cyan',
      bg: 'bg-accent-cyan',
    },
    'accent-yellow': {
      text: 'text-accent-yellow',
      bg: 'bg-accent-yellow',
    },
    'accent-orange': {
      text: 'text-accent-orange',
      bg: 'bg-accent-orange',
    },
    'accent-green': {
      text: 'text-accent-green',
      bg: 'bg-accent-green',
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className="group relative text-center p-8 rounded-2xl glass hover:scale-105 transition-all duration-300"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className={`w-16 h-16 rounded-full ${colors.bg} bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-8 h-8 ${colors.text}`} />
        </div>
      </div>

      {/* Value */}
      <div className={`text-4xl lg:text-5xl font-bold mb-2 ${colors.text}`}>
        {value}
      </div>

      {/* Label */}
      <div className="text-text-muted font-medium">
        {label}
      </div>

      {/* Hover effect */}
      <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none`} />
    </div>
  );
}