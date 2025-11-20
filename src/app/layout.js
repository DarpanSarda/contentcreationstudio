// app/layout.jsx
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import SmartLayout from '@/app/components/layout/SmartLayout';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              <SmartLayout>
                {children}
              </SmartLayout>
            </AuthProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'ContentStudio - AI-Powered Content Creation',
  description: 'Research, write, and publish content across all platforms in minutes with AI agents',
  keywords: 'AI content, content creation, automated writing, blog automation, social media automation',
};