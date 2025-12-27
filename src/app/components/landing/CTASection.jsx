// components/landing/CTASection.jsx
'use client';

import Link from 'next/link';
import { Rocket, TrendingDown, Play, MessageCircle, Sparkles } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-accent-cyan/10 via-dark-bg to-accent-purple/10 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent-orange/10 border border-accent-orange/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-accent-orange" />
            <span className="text-sm font-medium text-accent-orange">Start Creating Today</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            Ready to
            <span className="gradient-text"> Transform Your Content?</span>
          </h2>

          <p className="text-xl text-text-muted max-w-3xl mx-auto mb-12">
            Join thousands of creators using AI to research, write, and publish amazing content.
            Start your free trial today—no credit card required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/register"
              className="group relative bg-gradient-to-r from-accent-orange to-accent-yellow hover:opacity-90 text-dark-bg px-10 py-5 rounded-lg font-bold text-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-accent-orange/30 flex items-center justify-center gap-3"
            >
              <Rocket className="w-6 h-6" />
              Start Free Trial
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                14 Days Free
              </div>
            </Link>

            <Link
              href="/pricing"
              className="group border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-dark-bg px-10 py-5 rounded-lg font-bold text-xl transition-all hover:scale-105 flex items-center justify-center gap-3"
            >
              <TrendingDown className="w-6 h-6" />
              View Pricing
              <span className="text-sm bg-green-500/20 text-green-500 group-hover:text-dark-bg px-2 py-0.5 rounded-full">
                Save 80%
              </span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-text-muted">
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
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Setup in 5 minutes</span>
            </div>
          </div>
        </div>

        {/* Secondary CTAs */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Watch Demo */}
          <div className="glass rounded-xl p-6 border border-white/10 hover:border-accent-cyan/50 transition-all text-center">
            <div className="w-12 h-12 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-accent-cyan" />
            </div>
            <h3 className="text-lg font-bold text-text-light mb-2">Watch Demo</h3>
            <p className="text-sm text-text-muted mb-4">
              See how our platform works in action
            </p>
            <button className="text-accent-cyan hover:underline text-sm font-semibold">
              Watch Video →
            </button>
          </div>

          {/* Talk to Sales */}
          <div className="glass rounded-xl p-6 border border-white/10 hover:border-accent-purple/50 transition-all text-center">
            <div className="w-12 h-12 bg-accent-purple/10 border border-accent-purple/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-accent-purple" />
            </div>
            <h3 className="text-lg font-bold text-text-light mb-2">Talk to Sales</h3>
            <p className="text-sm text-text-muted mb-4">
              Get a personalized demo for your team
            </p>
            <button className="text-accent-purple hover:underline text-sm font-semibold">
              Contact Sales →
            </button>
          </div>

          {/* Documentation */}
          <div className="glass rounded-xl p-6 border border-white/10 hover:border-accent-orange/50 transition-all text-center">
            <div className="w-12 h-12 bg-accent-orange/10 border border-accent-orange/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-text-light mb-2">Documentation</h3>
            <p className="text-sm text-text-muted mb-4">
              Explore our guides and API docs
            </p>
            <button className="text-accent-orange hover:underline text-sm font-semibold">
              Read Docs →
            </button>
          </div>
        </div>

        {/* Final Message */}
        <div className="text-center mt-16">
          <p className="text-lg text-text-muted">
            Questions? Check out our{' '}
            <Link href="/help" className="text-accent-cyan hover:underline">
              Help Center
            </Link>
            {' '}or{' '}
            <Link href="/support" className="text-accent-cyan hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}