// components/landing/HeroSection.jsx
'use client';

import Link from 'next/link';
import { Sparkles, Zap, Rocket, TrendingDown, Search, Palette, Target, BarChart3 } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 border border-accent-cyan/30 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
              <span className="text-sm font-medium text-accent-cyan">Multi-LLM AI Platform</span>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full ml-2">
                Save 80% with BYOK
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">AI-Powered</span>
              <br />
              Content Creation
              <br />
              <span className="text-accent-orange">10x Faster</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-text-muted mb-8 max-w-2xl">
              Research, write, and publish SEO-optimized content across all platforms with your brand voice.
              Multi-LLM support with smart fallback. Use your own API keys and save 80%.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
              <div className="flex items-center gap-2 bg-card-bg/40 border border-white/10 rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-accent-yellow" />
                <span className="text-sm font-medium">Multi-LLM Support</span>
              </div>
              <div className="flex items-center gap-2 bg-card-bg/40 border border-white/10 rounded-full px-4 py-2">
                <Search className="w-4 h-4 text-accent-cyan" />
                <span className="text-sm font-medium">Web Research</span>
              </div>
              <div className="flex items-center gap-2 bg-card-bg/40 border border-white/10 rounded-full px-4 py-2">
                <Palette className="w-4 h-4 text-accent-purple" />
                <span className="text-sm font-medium">Brand Voice</span>
              </div>
              <div className="flex items-center gap-2 bg-card-bg/40 border border-white/10 rounded-full px-4 py-2">
                <Target className="w-4 h-4 text-accent-orange" />
                <span className="text-sm font-medium">SEO Optimized</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link
                href="/register"
                className="group relative bg-gradient-to-r from-accent-orange to-accent-yellow hover:opacity-90 text-dark-bg px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent-orange/30 flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Start Free Trial
                <Zap className="w-4 h-4 animate-pulse" />
              </Link>
              <Link
                href="/pricing"
                className="group border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-dark-bg px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
              >
                <TrendingDown className="w-5 h-5" />
                View Pricing
                <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Save 80%</span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Right Visual - Feature Showcase */}
          <div className="hidden lg:block">
            <div className="relative w-full h-[600px]">
              {/* Feature Cards Floating Animation */}
              <div className="absolute inset-0 flex items-center justify-center">

                {/* Multi-LLM Card */}
                <div className="absolute top-0 left-0 animate-float">
                  <div className="glass rounded-xl p-4 border border-accent-cyan/30 max-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-accent-yellow" />
                      <span className="text-sm font-bold">Multi-LLM</span>
                    </div>
                    <p className="text-xs text-text-muted">OpenAI, Anthropic, Google, DeepSeek</p>
                    <div className="flex gap-1 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>

                {/* Web Research Card */}
                <div className="absolute top-20 right-0 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="glass rounded-xl p-4 border border-accent-cyan/30 max-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="w-5 h-5 text-accent-cyan" />
                      <span className="text-sm font-bold">Web Research</span>
                    </div>
                    <p className="text-xs text-text-muted">Real-time data from Brave, Tavily, Serper</p>
                    <div className="mt-2 flex items-center gap-1">
                      <BarChart3 className="w-3 h-3 text-accent-cyan" />
                      <span className="text-xs text-accent-cyan">Live Data</span>
                    </div>
                  </div>
                </div>

                {/* Brand Voice Card */}
                <div className="absolute bottom-32 left-10 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="glass rounded-xl p-4 border border-accent-purple/30 max-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-5 h-5 text-accent-purple" />
                      <span className="text-sm font-bold">Brand Voice</span>
                    </div>
                    <p className="text-xs text-text-muted">Consistent tone across all content</p>
                    <div className="mt-2 text-xs text-accent-purple">Customizable</div>
                  </div>
                </div>

                {/* SEO Optimization Card */}
                <div className="absolute bottom-0 right-20 animate-float" style={{ animationDelay: '3s' }}>
                  <div className="glass rounded-xl p-4 border border-accent-orange/30 max-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-accent-orange" />
                      <span className="text-sm font-bold">SEO Optimized</span>
                    </div>
                    <p className="text-xs text-text-muted">Rank higher on search engines</p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="text-xs text-green-500">↑ 300% Traffic</div>
                    </div>
                  </div>
                </div>

                {/* BYOK Savings Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: '4s' }}>
                  <div className="glass rounded-2xl p-6 border-2 border-green-500/30 text-center">
                    <TrendingDown className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-4xl font-bold text-green-500 mb-1">80%</div>
                    <div className="text-sm text-text-muted">Savings with BYOK</div>
                  </div>
                </div>

                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#00FFC8', stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: '#FF652F', stopOpacity: 0.3 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 100 100 Q 300 200, 400 300"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                  <path
                    d="M 500 150 Q 400 250, 300 350"
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