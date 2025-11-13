// app/(app)/layout.jsx
import { Inter } from 'next/font/google';
import '../globals.css';
import AppNavigation from '@/app/components/layout/AppNavigation';

const inter = Inter({ subsets: ['latin'] });

export default function AppLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AppNavigation />
        {children}
      </body>
    </html>
  );
}