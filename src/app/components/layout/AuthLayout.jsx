// components/layout/AuthLayout.jsx
'use client';

import AppNavigation from '@/app/components/layout/AppNavigation';

export default function AuthLayout({ children }) {
  return (
    <>
      <AppNavigation />
      {children}
    </>
  );
}