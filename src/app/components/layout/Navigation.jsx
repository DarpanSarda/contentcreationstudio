// components/layout/Navigation.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-accent-yellow rounded-lg flex items-center justify-center font-bold text-xl transition-transform group-hover:scale-110">
              C
            </div>
            <span className="text-xl font-bold">
              Content<span className="text-accent-orange">Studio</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-text-light hover:text-accent-cyan transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-text-light hover:text-accent-cyan transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-text-light hover:text-accent-cyan transition-colors">
              Pricing
            </Link>
            <Link href="#docs" className="text-text-light hover:text-accent-cyan transition-colors">
              Docs
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-text-light hover:text-accent-cyan transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-accent-orange hover:bg-opacity-90 text-white px-6 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent-orange/30"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-card-bg/20"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <Link href="#features" className="block py-2 text-text-light hover:text-accent-cyan transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="block py-2 text-text-light hover:text-accent-cyan transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="block py-2 text-text-light hover:text-accent-cyan transition-colors">
              Pricing
            </Link>
            <Link href="#docs" className="block py-2 text-text-light hover:text-accent-cyan transition-colors">
              Docs
            </Link>
            <div className="pt-4 space-y-2 border-t border-white/10">
              <Link href="/login" className="block py-2 text-text-light hover:text-accent-cyan transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="block bg-accent-orange text-white px-6 py-2.5 rounded-lg font-semibold text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}