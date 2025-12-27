// components/layout/SmartLayout.jsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navigation from '@/app/components/layout/Navigation';
import Footer from '@/app/components/layout/Footer';
import AppNavigation from '@/app/components/layout/AppNavigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SmartLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Auth pages - no navigation
  const isAuthPage = ['/login', '/register', '/reset-password'].includes(pathname);

  // Authenticated app pages - app navigation only
  const isAppPage = ['/dashboard', '/content', '/research', '/publishing', '/analytics', '/agents', '/settings', '/help', '/support', '/about', '/notifications', '/pricing']
    .some(route => pathname.startsWith(route));

  // Landing page - landing navigation + footer
  const isLandingPage = pathname === '/';

  // Handle authentication redirects
  useEffect(() => {
    if (!isLoading) {
      // If trying to access protected pages without authentication
      if (isAppPage && !isAuthenticated) {
        router.push('/login');
        return;
      }

      // If trying to access auth pages while already authenticated
      if (isAuthPage && isAuthenticated) {
        router.push('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, isLoading, isAppPage, isAuthPage, router, pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Auth pages - no navigation */}
      {isAuthPage && children}

      {/* Authenticated app pages */}
      {isAppPage && (
        <>
          <AppNavigation />
          <div className="pt-16">
            {children}
          </div>
        </>
      )}

      {/* Landing page */}
      {isLandingPage && (
        <>
          <Navigation />
          {children}
          <Footer />
        </>
      )}
    </>
  );
}