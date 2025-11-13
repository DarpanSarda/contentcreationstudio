// components/landing/CTASection.tsx
'use client';

import Link from 'next/link';
import { Rocket, CheckCircle } from 'lucide-react';

export default function CTASection() {
  const benefits = [
    'No credit card required',
    '14-day free trial',
    'Cancel anytime',
    'Full platform access',
    'Email support',
    'Setup assistance',
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-orange/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-accent-green/10 border border-accent-green/30 rounded-full px-4 py-2 mb-8">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
          <span className="text-sm font-medium text-accent-green">Limited Time Offer</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl lg:text-6xl font-bold mb-6">
          Ready to <span className="text-accent-orange">Automate</span> Your Content?
        </h2>

        {/* Subheading */}
        <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto">
          Start creating professional content in minutes. No technical skills required.
          Join thousands of content creators who've made the switch.
        </p>

        {/* Benefits List */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-left">
              <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0" />
              <span className="text-text-light">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Link
            href="/register"
            className="group relative bg-accent-orange hover:bg-opacity-90 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-accent-orange/40 flex items-center gap-3"
          >
            <Rocket className="w-6 h-6 group-hover:translate-y-[-4px] transition-transform" />
            Start Free Trial
          </Link>

          <Link
            href="#demo"
            className="text-accent-cyan hover:text-accent-cyan/80 font-semibold text-lg transition-colors underline decoration-wavy"
          >
            Watch 2-min Demo →
          </Link>
        </div>

        {/* Trust indicator */}
        <p className="text-sm text-text-muted">
          Join 2,000+ content creators • No payment required
        </p>

        {/* Testimonial Quote */}
        <div className="mt-16 glass rounded-2xl p-8 max-w-2xl mx-auto border border-accent-cyan/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-orange to-accent-yellow flex items-center justify-center text-xl font-bold flex-shrink-0">
              S
            </div>
            <div className="text-left">
              <p className="text-text-light italic mb-4">
                "This tool cut our content creation time by 80%. We went from publishing 2 articles a week to 10. Game changer for our marketing team."
              </p>
              <div>
                <p className="font-semibold text-accent-cyan">Sarah Johnson</p>
                <p className="text-sm text-text-muted">Head of Marketing, TechStartup Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}