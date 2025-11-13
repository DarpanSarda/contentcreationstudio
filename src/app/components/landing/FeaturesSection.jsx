// components/landing/FeaturesSection.tsx
'use client';

import { Search, PenTool, Share2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesSection() {
  const features = [
    {
      id: 1,
      icon: 'starburst',
      color: 'yellow',
      title: 'INTELLIGENT RESEARCH',
      subtitle: 'automated information gathering',
      description: 'Our AI agent scours the web, academic papers, and trusted sources to gather comprehensive, accurate information on any topic.',
      link: 'see how it works',
      linkColor: 'accent-cyan',
    },
    {
      id: 2,
      icon: 'star',
      color: 'cyan',
      title: 'AI CONTENT CREATION',
      subtitle: 'blog posts and social media',
      description: 'Generate high-quality, SEO-optimized content in your brand voice. From long-form articles to Twitter threads.',
      link: 'try it now',
      linkColor: 'accent-orange',
    },
    {
      id: 3,
      icon: 'circle',
      color: 'orange',
      title: 'MULTI-PLATFORM PUBLISHING',
      subtitle: 'distribute everywhere instantly',
      description: 'Publish to WordPress, Medium, Twitter, LinkedIn, and more with a single click. Schedule for optimal engagement.',
      link: 'connect platforms',
      linkColor: 'accent-yellow',
    },
  ];

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Three <span className="text-accent-orange">AI Agents</span> Working For You
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Each specialized agent handles a specific part of your content workflow
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, color, title, subtitle, description, link, linkColor }) {
  const colorClasses = {
    yellow: {
      bg: 'bg-accent-yellow',
      border: 'border-accent-yellow/30',
      glow: 'hover:shadow-accent-yellow/20',
      text: 'text-accent-yellow',
    },
    cyan: {
      bg: 'bg-accent-cyan',
      border: 'border-accent-cyan/30',
      glow: 'hover:shadow-accent-cyan/20',
      text: 'text-accent-cyan',
    },
    orange: {
      bg: 'bg-accent-orange',
      border: 'border-accent-orange/30',
      glow: 'hover:shadow-accent-orange/20',
      text: 'text-accent-orange',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`group relative bg-card-bg/20 glass rounded-2xl p-8 border ${colors.border} hover:border-opacity-60 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${colors.glow}`}>
      {/* Icon */}
      <div className="flex justify-center mb-8">
        {icon === 'starburst' && <StarburstIcon color={color} />}
        {icon === 'star' && <StarIconSVG color={color} />}
        {icon === 'circle' && <CircleIconSVG color={color} />}
      </div>

      {/* Title */}
      <h3 className={`text-xl font-bold tracking-wider mb-2 ${colors.text} text-center`}>
        {title}
      </h3>

      {/* Subtitle */}
      <p className="text-text-muted text-sm text-center mb-6">
        {subtitle}
      </p>

      {/* Description */}
      <p className="text-text-light/80 text-center mb-8 leading-relaxed">
        {description}
      </p>

      {/* Link with wavy underline */}
      <div className="flex justify-center">
        <button
          className={`relative inline-flex items-center gap-2 ${colors.text} font-medium wavy-underline group-hover:translate-x-1 transition-transform bg-transparent border-none cursor-pointer`}
          onClick={() => {
            // Handle click based on feature
            console.log(`${title} - ${link}`);
          }}
        >
          {link}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hover effect overlay */}
      <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none`} />
    </div>
  );
}

// Icon Components matching Assiko fireworks design
function StarburstIcon({ color }) {
  const colorMap = {
    yellow: '#FEE400',
    cyan: '#00FFC8',
    orange: '#FF652F',
  };

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse-slow">
      {/* Central circle */}
      <circle cx="60" cy="60" r="8" fill={colorMap[color]} />
      
      {/* Radiating lines with dots */}
      {[...Array(16)].map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180;
        const x1 = 60 + 15 * Math.cos(angle);
        const y1 = 60 + 15 * Math.sin(angle);
        const x2 = 60 + 45 * Math.cos(angle);
        const y2 = 60 + 45 * Math.sin(angle);
        const x3 = 60 + 50 * Math.cos(angle);
        const y3 = 60 + 50 * Math.sin(angle);

        return (
          <g key={i} opacity="0.9">
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colorMap[color]} strokeWidth="2" />
            <circle cx={x3} cy={y3} r="3" fill={colorMap[color]} />
          </g>
        );
      })}
    </svg>
  );
}

function StarIconSVG({ color }) {
  const colorMap = {
    yellow: '#FEE400',
    cyan: '#00FFC8',
    orange: '#FF652F',
  };

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse-slow">
      {/* 8-pointed star */}
      <path
        d="M 60 10 L 65 50 L 110 60 L 65 70 L 60 110 L 55 70 L 10 60 L 55 50 Z 
           M 60 20 L 90 40 L 100 60 L 90 80 L 60 100 L 30 80 L 20 60 L 30 40 Z"
        fill={colorMap[color]}
        stroke={colorMap[color]}
        strokeWidth="2"
        opacity="0.9"
      />
      {/* Center detail */}
      <circle cx="60" cy="60" r="5" fill={colorMap[color]} />
    </svg>
  );
}

function CircleIconSVG({ color }) {
  const colorMap = {
    yellow: '#FEE400',
    cyan: '#00FFC8',
    orange: '#FF652F',
  };

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse-slow">
      {/* Central circle */}
      <circle cx="60" cy="60" r="12" fill={colorMap[color]} opacity="0.9" />
      
      {/* Four outer circles */}
      <circle cx="60" cy="25" r="8" fill={colorMap[color]} opacity="0.8" />
      <circle cx="95" cy="60" r="8" fill={colorMap[color]} opacity="0.8" />
      <circle cx="60" cy="95" r="8" fill={colorMap[color]} opacity="0.8" />
      <circle cx="25" cy="60" r="8" fill={colorMap[color]} opacity="0.8" />

      {/* Triangular elements between */}
      <path d="M 60 40 L 55 50 L 65 50 Z" fill={colorMap[color]} opacity="0.6" />
      <path d="M 80 60 L 70 55 L 70 65 Z" fill={colorMap[color]} opacity="0.6" />
      <path d="M 60 80 L 55 70 L 65 70 Z" fill={colorMap[color]} opacity="0.6" />
      <path d="M 40 60 L 50 55 L 50 65 Z" fill={colorMap[color]} opacity="0.6" />

      {/* Decorative spikes around outer edge */}
      {[...Array(24)].map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x1 = 60 + 50 * Math.cos(angle);
        const y1 = 60 + 50 * Math.sin(angle);
        const x2 = 60 + 55 * Math.cos(angle);
        const y2 = 60 + 55 * Math.sin(angle);

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={colorMap[color]}
            strokeWidth="2"
            opacity="0.4"
          />
        );
      })}
    </svg>
  );
}