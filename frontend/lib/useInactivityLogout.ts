'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession } from '@/lib/session';

/**
 * Interval ping kejadian aktivitas pengguna (ms). Semua kejadian dalam
 * jendela ini dianggap satu batch agar listener tidak dijalankan berlebihan.
 */
const ACTIVITY_THROTTLE_MS = 60_000;

/** Kejadian yang menandakan pengguna masih aktif. */
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'wheel',
  'touchstart',
  'scroll',
];

/**
 * Auto-logout karena ketidakhadiran (inactivity timeout).
 *
 * Reset timer pada kejadian aktivitas (mouse, klik, keyboard, scroll, sentuh).
 * Setelah INACTIVITY_TIMEOUT_MS tanpa aktivitas, sesi dibersihkan total
 * (cookie + localStorage + seluruh state app) dan user dilempar ke /login
 * dengan pesan penyebab.
 */
export default function useInactivityLogout() {
  const router = useRouter();

  useEffect(() => {
    // Durasi timeout diambil dari env agar mudah disesuaikan (default 60 menit).
    const timeoutMs = Number(
      process.env.NEXT_PUBLIC_INACTIVITY_TIMEOUT_MS ?? 60 * 60 * 1000
    );

    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastPing = 0;

    const logout = () => {
      // Hapus seluruh jejak sesi: cookie, localStorage, dan state app.
      clearSession();
      router.replace('/login?reason=timeout');
    };

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(logout, timeoutMs);
    };

    const handleActivity = () => {
      const now = Date.now();
      // Throttle: cukup satu reset per jendela ACTIVITY_THROTTLE_MS.
      if (now - lastPing < ACTIVITY_THROTTLE_MS) return;
      lastPing = now;
      resetTimer();
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, handleActivity, { passive: true });
    }

    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, handleActivity);
      }
    };
  }, [router]);
}
