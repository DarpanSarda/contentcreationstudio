// components/layout/SmartLayout.jsx
'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/app/components/layout/Navigation';
import Footer from '@/app/components/layout/Footer';
import AppNavigation from '@/app/components/layout/AppNavigation';

export default function SmartLayout({ children }) {
  const pathname = usePathname();

  // Routes that should NOT show landing navigation/footer
  const specialRoutes = [
    '/login',
    '/register',
    '/reset-password',
    '/dashboard',
    '/content',
    '/research',
    '/publishing',
    '/analytics',
    '/agents',
    '/settings'
  ];

  const isSpecialRoute = specialRoutes.includes(pathname) ||
    specialRoutes.some(route => pathname.startsWith(route + '/'));

  const isAuthPage = ['/login', '/register', '/reset-password'].includes(pathname);

  return (
    <>
      {/* Landing page navigation and footer */}
      {!isSpecialRoute && (
        <>
          <Navigation />
          <Footer />
        </>
      )}

      {/* Authenticated app navigation */}
      {isSpecialRoute && !isAuthPage && <AppNavigation />}

      {/* Page content */}
      {children}
    </>
  );
}