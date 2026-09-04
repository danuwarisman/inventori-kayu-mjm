'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/';

  return (
    <html lang="id">
      <body className="antialiased bg-stone-100 text-stone-900">
        {isAuthPage ? (
          <main className="min-h-screen w-full">{children}</main>
        ) : (
          <div className="flex min-h-screen">
            <Sidebar role="manager" />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}