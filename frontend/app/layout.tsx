// frontend/app/layout.tsx

import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/hooks/useAuth';
import { NotificationProvider } from '@/context/NotificationContext';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Todo App - Task Management',
    template: '%s | Todo App'
  },
  description: 'A secure, responsive todo application with JWT authentication for effective task management.',
  keywords: ['todo', 'task management', 'productivity', 'secure', 'JWT', 'authentication'],
  authors: [{ name: 'Todo App Team' }],
  creator: 'Todo App Team',
  publisher: 'Todo App Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://todo-app.example.com',
    title: 'Todo App - Task Management',
    description: 'A secure, responsive todo application with JWT authentication for effective task management.',
    siteName: 'Todo App',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Todo App - Task Management',
    description: 'A secure, responsive todo application with JWT authentication for effective task management.',
  },
  metadataBase: new URL('https://todo-app.example.com'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <NotificationProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />

              <main className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>

              {/* Footer */}
              <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                  <p className="text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Todo App. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}