// components/layout/SmartLayout.jsx
'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/app/components/layout/Navigation';
import Footer from '@/app/components/layout/Footer';
import AppNavigation from '@/app/components/layout/AppNavigation';

export default function SmartLayout({ children }) {
  const pathname = usePathname();

  // Auth pages - no navigation
  const isAuthPage = ['/login', '/register', '/reset-password'].includes(pathname);

  // Authenticated app pages - app navigation only
  const isAppPage = ['/dashboard', '/content', '/research', '/publishing', '/analytics', '/agents', '/settings', '/help', '/support', '/about']
    .some(route => pathname.startsWith(route));

  // Landing page - landing navigation + footer
  const isLandingPage = pathname === '/';

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