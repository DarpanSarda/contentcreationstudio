// app/not-found.jsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Home,
  Search,
  FileText,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
  HelpCircle,
  Mail,
  Github,
  Twitter,
  MessageSquare
} from 'lucide-react';

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      // Simple search functionality
      window.location.href = `/content?search=${encodeURIComponent(e.target.value)}`;
    }
  };

  const suggestedPages = [
    {
      title: 'Content Library',
      description: 'Browse and manage your created content',
      href: '/content',
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: 'Analytics Dashboard',
      description: 'View content performance metrics',
      href: '/analytics',
      icon: <Search className="w-5 h-5" />
    },
    {
      title: 'Create New Content',
      description: 'Start creating amazing content with AI',
      href: '/content/new',
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const helpfulLinks = [
    {
      title: 'Documentation',
      description: 'Learn how to use ContentStudio effectively',
      href: '/docs',
      icon: <HelpCircle className="w-4 h-4" />
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      href: 'mailto:support@contentstudio.com',
      icon: <Mail className="w-4 h-4" />
    },
    {
      title: 'GitHub Issues',
      description: 'Report bugs or request features',
      href: 'https://github.com/contentstudio/issues',
      icon: <Github className="w-4 h-4" />
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      href: 'https://community.contentstudio.com',
      icon: <MessageSquare className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-yellow/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-9xl font-bold text-accent-orange opacity-20">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle className="w-24 h-24 text-accent-orange" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-text-light mb-4">
            Page Not Found
          </h1>

          <p className="text-xl text-text-muted mb-8">
            Oops! The page you're looking for seems to have vanished into the digital void.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search for content..."
                onKeyPress={handleSearch}
                className="w-full pl-10 pr-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
              />
            </div>
          </div>

          {/* Auto-redirect notification */}
          {isRedirecting && (
            <div className="flex items-center justify-center gap-2 p-4 bg-accent-green/20 border border-accent-green/30 rounded-lg">
              <RefreshCw className="w-5 h-5 text-accent-green animate-spin" />
              <span className="text-accent-green font-medium">Redirecting to home...</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent-orange/30"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
            <Link
              href="/content"
              className="flex items-center gap-2 px-6 py-3 border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-dark-bg rounded-lg font-semibold transition-all"
            >
              <FileText className="w-5 h-5" />
              Browse Content
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 border border-white/20 text-text-light hover:bg-card-bg/20 rounded-lg font-semibold transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Suggested Pages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {suggestedPages.map((page, index) => (
              <Link
                key={index}
                href={page.href}
                className="flex items-start gap-3 p-4 border border-white/10 rounded-lg hover:bg-card-bg/10 hover:border-accent-cyan/50 transition-all group"
              >
                <div className="w-12 h-12 bg-card-bg/20 border border-white/20 rounded-lg flex items-center justify-center text-accent-cyan group-hover:bg-accent-cyan/20 transition-colors">
                  {page.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-text-light mb-1">{page.title}</h3>
                  <p className="text-sm text-text-muted">{page.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Helpful Links */}
          <div className="border-t border-white/10 pt-8">
            <h3 className="text-lg font-semibold text-text-light mb-4">Need Help?</h3>
            <div className="grid grid-cols-2 gap-4">
              {helpfulLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-cyan transition-colors"
                >
                  {link.icon}
                  <span>{link.title}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Fun Animation */}
          <div className="mt-8">
            <p className="text-sm text-text-muted mb-4">
              While you wait, here's a fun fact about 404 errors:
            </p>
            <div className="bg-card-bg/20 border border-white/10 rounded-lg p-4">
              <p className="text-accent-cyan font-medium">
                The number 404 comes from the HTTP status code "Not Found,"
                which was designated by Tim Berners-Lee in 1992.
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 p-6 bg-accent-orange/10 border border-accent-orange/30 rounded-lg">
          <h3 className="text-lg font-bold text-text-light mb-2">
            Can't find what you're looking for?
          </h3>
          <p className="text-text-muted mb-4">
            Our AI agents are here to help! Try searching above or contact our support team.
          </p>
          <Link
            href="/content/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-semibold transition-all hover:scale-105"
          >
            <FileText className="w-5 h-5" />
            Create New Content
          </Link>
        </div>
      </div>
    </div>
  );
}