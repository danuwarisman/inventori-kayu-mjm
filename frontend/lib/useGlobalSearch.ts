'use client';

import { useSyncExternalStore } from 'react';

const GLOBAL_SEARCH_EVENT = 'mjm:global-search';

type SearchWindow = Window & {
  __mjmGlobalSearch?: string;
};

const listeners = new Set<() => void>();

/** Ambil nilai query pencarian global saat ini di sisi client. */
export function getGlobalSearchSnapshot(): string {
  if (typeof window === 'undefined') return '';
  return (window as SearchWindow).__mjmGlobalSearch ?? '';
}

function getServerSearchSnapshot(): string {
  return '';
}

function subscribeGlobalSearch(callback: () => void): () => void {
  listeners.add(callback);

  const handleEvent = () => callback();
  if (typeof window !== 'undefined') {
    window.addEventListener(GLOBAL_SEARCH_EVENT, handleEvent);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener(GLOBAL_SEARCH_EVENT, handleEvent);
    }
  };
}

/**
 * Memperbarui query pencarian global dari Header bar dan memberitahu seluruh
 * halaman yang berlangganan agar tabel ikut terfilter secara langsung.
 */
export function dispatchGlobalSearch(query: string): void {
  if (typeof window === 'undefined') return;
  (window as SearchWindow).__mjmGlobalSearch = query;
  window.dispatchEvent(
    new CustomEvent<string>(GLOBAL_SEARCH_EVENT, { detail: query })
  );
  listeners.forEach((listener) => listener());
}

/**
 * Hook reaktif untuk membaca query pencarian global dari Header.
 * Menggunakan useSyncExternalStore agar aman untuk SSR Next.js.
 */
export function useGlobalSearch(): string {
  return useSyncExternalStore(
    subscribeGlobalSearch,
    getGlobalSearchSnapshot,
    getServerSearchSnapshot
  );
}
