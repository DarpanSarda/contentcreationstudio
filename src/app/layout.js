// app/layout.jsx
import { Inter } from 'next/font/google';
import './globals.css';
import SmartLayout from '@/app/components/layout/SmartLayout';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <SmartLayout>
          {children}
        </SmartLayout>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'ContentStudio - AI-Powered Content Creation',
  description: 'Research, write, and publish content across all platforms in minutes with AI agents',
  keywords: 'AI content, content creation, automated writing, blog automation, social media automation',
};