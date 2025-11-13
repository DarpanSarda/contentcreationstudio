// components/landing/HeroSection.tsx
'use client';

import Link from 'next/link';
import { Sparkles, Zap, Rocket } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-yellow/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-accent-orange/10 border border-accent-orange/30 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-accent-orange" />
              <span className="text-sm font-medium text-accent-orange">AI-Powered Content Engine</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-accent-orange">AI-Powered</span>
              <br />
              Content Creation
              <br />
              <span className="gradient-text">On Autopilot</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-text-muted mb-10 max-w-2xl">
              Research, Write, and Publish content across all platforms in minutes, not hours.
              Let AI agents handle the heavy lifting while you focus on strategy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link
                href="/register"
                className="group relative bg-accent-orange hover:bg-opacity-90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent-orange/30 flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Start Creating Free
                <Zap className="w-4 h-4 animate-pulse" />
              </Link>
              <Link
                href="#demo"
                className="group border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-dark-bg px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
              >
                Watch Demo
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Trust indicators */}
            <p className="text-sm text-text-muted">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>

          {/* Right Visual - Workflow Animation */}
          <div className="hidden lg:block">
            <div className="relative w-full h-[600px]">
              {/* Central workflow visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Topic Input */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-float">
                  <div className="bg-card-bg/30 glass rounded-xl p-4 border border-accent-cyan/30">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-accent-cyan rounded-full animate-pulse" />
                      <span className="text-sm font-medium">Topic Input</span>
                    </div>
                  </div>
                </div>

                {/* Research Agent - Yellow Starburst */}
                <div className="absolute top-32 left-20 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="relative">
                    <StarburstIcon color="accent-yellow" />
                    <div className="mt-4 text-center">
                      <p className="text-xs font-bold tracking-wider text-accent-yellow">RESEARCH</p>
                      <p className="text-xs text-text-muted">Gathering data</p>
                    </div>
                  </div>
                </div>

                {/* Writing Agent - Cyan Star */}
                <div className="absolute top-32 right-20 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="relative">
                    <StarIcon color="accent-cyan" />
                    <div className="mt-4 text-center">
                      <p className="text-xs font-bold tracking-wider text-accent-cyan">WRITING</p>
                      <p className="text-xs text-text-muted">Creating content</p>
                    </div>
                  </div>
                </div>

                {/* Publishing Agent - Orange Circle */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: '3s' }}>
                  <div className="relative">
                    <CircleIcon color="accent-orange" />
                    <div className="mt-4 text-center">
                      <p className="text-xs font-bold tracking-wider text-accent-orange">PUBLISHING</p>
                      <p className="text-xs text-text-muted">Going live</p>
                    </div>
                  </div>
                </div>

                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#FEE400', stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: '#00FFC8', stopOpacity: 0.3 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 300 100 Q 200 200, 250 350"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                  <path
                    d="M 400 100 Q 450 200, 350 350"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

// Icon Components matching Assiko style
function StarburstIcon({ color }) {
  const colorMap = {
    'accent-yellow': '#FEE400',
    'accent-cyan': '#00FFC8',
    'accent-orange': '#FF652F',
  };

  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* Central circle */}
        <circle cx="60" cy="60" r="8" fill={colorMap[color]} className="animate-glow" />
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
    </div>
  );
}

function StarIcon({ color }) {
  const colorMap = {
    'accent-yellow': '#FEE400',
    'accent-cyan': '#00FFC8',
    'accent-orange': '#FF652F',
  };

  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M 50 10 L 55 45 L 90 50 L 55 55 L 50 90 L 45 55 L 10 50 L 45 45 Z"
          fill={colorMap[color]}
          stroke={colorMap[color]}
          strokeWidth="2"
          className="animate-glow"
        />
      </svg>
    </div>
  );
}

function CircleIcon({ color }) {
  const colorMap = {
    'accent-yellow': '#FEE400',
    'accent-cyan': '#00FFC8',
    'accent-orange': '#FF652F',
  };

  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Central circle */}
        <circle cx="50" cy="50" r="15" fill={colorMap[color]} className="animate-glow" />
        {/* Outer circles */}
        <circle cx="50" cy="20" r="8" fill={colorMap[color]} opacity="0.8" />
        <circle cx="80" cy="50" r="8" fill={colorMap[color]} opacity="0.8" />
        <circle cx="50" cy="80" r="8" fill={colorMap[color]} opacity="0.8" />
        <circle cx="20" cy="50" r="8" fill={colorMap[color]} opacity="0.8" />
        {/* Decorative spikes */}
        {[...Array(16)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={50 + 45 * Math.cos(i * Math.PI / 8)}
            y2={50 + 45 * Math.sin(i * Math.PI / 8)}
            stroke={colorMap[color]}
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
      </svg>
    </div>
  );
}