'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  SESSION_COOKIE,
  clearSession,
  getSessionUser,
  SessionUser,
  ROLE_LABELS,
  ROLE_ACCESS,
  getDashboardPath,
} from '@/lib/session';
import useInactivityLogout from '@/lib/useInactivityLogout';
import useSessionUser from '@/lib/useSessionUser';

// Halaman yang tampil tanpa Sidebar/Header
const AUTH_PATHS = ['/login', '/'];

/**
 * Wrapper client di sekeliling Sidebar + Header.
 * Membaca sesi login via useSyncExternalStore (tanpa setState di effect)
 * dan meneruskan role asli ke Sidebar.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user: SessionUser | null = useSessionUser();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isAuthPage = AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Tutup sidebar mobile setiap kali berpindah halaman
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  // Auto-logout setelah rentang waktu tanpa aktivitas (default 60 menit).
  // Hook sendiri yang me-reset seluruh sesi & state sebelum redirect.
  useInactivityLogout();

  // Client-side guard pendukung middleware (defense in depth).
  // PENTING: keputusan dibaca FRESH dari localStorage (getSessionUser),
  // bukan dari nilai render `user`. Saat hard-load, useSyncExternalStore
  // memakai getServerSnapshot (null) untuk render hidrasi; kalau effect
  // memakai nilai itu, guard salah menyimpulkan "sesi rusak" dan
  // me-redirect ke /login padahal user masih login.
  useEffect(() => {
    if (isAuthPage) return;
    const hasSessionCookie =
      typeof document !== 'undefined' &&
      document.cookie.includes(`${SESSION_COOKIE}=`);

    const freshUser = getSessionUser();

    if (!freshUser) {
      if (hasSessionCookie) {
        // Cookie ada tapi profil localStorage hilang -> sesi rusak.
        router.replace('/login');
      }
      // Cookie juga tidak ada: benar-benar belum login;
      // biarkan middleware yang menangani redirect-nya.
      return;
    }
    if (!hasSessionCookie) {
      // Profil ada tapi cookie kedaluwarsa/terhapus -> sesi tidak valid.
      clearSession();
      router.replace('/login');
      return;
    }

    const allowed = ROLE_ACCESS[pathname] ?? null;
    if (allowed !== null && !allowed.includes(freshUser.role)) {
      router.replace(getDashboardPath(freshUser.role));
    }
  }, [user, pathname, router, isAuthPage]);

  // Halaman login tetap polos tanpa shell
  if (isAuthPage) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  if (!user) {
    // Middleware sudah mencegah akses tanpa login; tampilan kosong hanya
    // muncul sesaat saat hydrasi atau bila sesi localStorage terhapus manual.
    return <div className="min-h-screen bg-stone-100" aria-busy="true" />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        role={user.role}
        userName={user.fullName}
        userRoleLabel={ROLE_LABELS[user.role]}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
