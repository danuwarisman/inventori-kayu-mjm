'use client';

import { useSyncExternalStore } from 'react';
import {
  getSessionSnapshot,
  getServerSessionSnapshot,
  subscribeSession,
  type SessionUser,
} from '@/lib/session';

/**
 * Hook untuk membaca profil user yang sedang login (client-side).
 *
 * Reaktif: otomatis re-render saat sesi berubah di tab yang sama
 * (login/logout/clearSession) maupun tab lain (storage event).
 * Mengembalikan null saat belum login / saat render di server.
 *
 * Dipakai untuk conditional rendering elemen UI per role (RBAC UX).
 * Catatan: backend tetap validator utama otorisasi.
 */
export default function useSessionUser(): SessionUser | null {
  return useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot
  );
}
