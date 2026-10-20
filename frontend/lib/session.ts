/**
 * Sesi login sederhana berbasis cookie (dibaca oleh middleware) + localStorage
 * (detail profil untuk UI). NOTE: ini proteksi UI-level untuk pengembangan;
 * otorisasi sebenarnya tetap harus divalidasi di backend/API.
 */

export type AppRole = 'manager' | 'admin_kantor' | 'admin_lapangan';

export const SESSION_COOKIE = 'mjm_session';
export const SESSION_USER_KEY = 'mjm_session_user';

/** User yang sedang login. */
export interface SessionUser {
  username: string;
  fullName: string;
  role: AppRole;
}

/** Label role untuk ditampilkan di Sidebar. */
export const ROLE_LABELS: Record<AppRole, string> = {
  manager: 'Manager',
  admin_kantor: 'Office Admin',
  admin_lapangan: 'Field Admin',
};

/** Role yang diizinkan untuk membuka halaman tertentu (null = semua role). */
export const ROLE_ACCESS: Record<string, AppRole[] | null> = {
  '/manager-dashboard': ['manager'],
  '/dashboard': ['admin_kantor', 'admin_lapangan'],
  '/master-data': null,
  '/sawmill': null,
  '/pra-dry-kiln': null,
  '/dry-kiln': null,
  '/stock-reports': null,
  '/suppliers': null,
  '/sales': null,
  '/customers': null,
  '/accounts': ['manager'],
  '/settings': null,
};

/** Dashboard default sesuai role. */
export function getDashboardPath(role: AppRole): string {
  return role === 'manager' ? '/manager-dashboard' : '/dashboard';
}

function encodeSession(user: SessionUser): string {
  return JSON.stringify(user);
}

function decodeSession(raw: string): SessionUser | null {
  try {
    const parsed = JSON.parse(raw) as SessionUser;
    if (
      parsed &&
      typeof parsed.username === 'string' &&
      typeof parsed.fullName === 'string' &&
      parsed.role in ROLE_LABELS
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/** Simpan sesi: cookie ringan (role) untuk middleware + profil lengkap di localStorage. */
export function saveSession(user: SessionUser): void {
  // Cookie dibaca middleware: hanya menyimpan role agar tetap ringan.
  // NOTE: saat auth backend sudah jalan, token sesi harus berupa cookie
  // HttpOnly + Secure + SameSite yang diset oleh SERVER (bukan di sini).
  document.cookie = `${SESSION_COOKIE}=${user.role}; path=/; max-age=${60 * 60 * 8}; samesite=lax`;
  localStorage.setItem(SESSION_USER_KEY, encodeSession(user));
  notifySessionChange();
}

/** Ambil profil user dari localStorage (client-side). */
export function getSessionUser(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_USER_KEY);
  return raw ? decodeSession(raw) : null;
}

/** Hapus semua jejak sesi + state/cache app agar data user sebelumnya tak tertinggal. */
export function clearSession(): void {
  // 1. Cookie milik app (sesi + redirect + yang tidak terdaftar, prefix mjm_)
  const appCookies = [SESSION_COOKIE, 'mjm_redirect'];
  for (const name of appCookies) {
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
  }
  if (typeof document !== 'undefined') {
    for (const part of document.cookie.split(';')) {
      const name = part.split('=')[0]?.trim();
      if (name && name.startsWith('mjm_') && !appCookies.includes(name)) {
        document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
      }
    }
  }

  // 2. Storage milik app (localStorage + sessionStorage, prefix mjm_)
  for (const store of [window.localStorage, window.sessionStorage]) {
    Object.keys(store)
      .filter((key) => key.startsWith('mjm_'))
      .forEach((key) => store.removeItem(key));
  }

  // 3. Reset cache snapshot agar UI langsung tahu sesi sudah tidak ada.
  cachedRaw = undefined;
  cachedUser = null;
  notifySessionChange();
}

// --- Integrasi dengan useSyncExternalStore (React 19) -----------------------
// Dipakai AppShell agar membaca sesi tanpa setState di dalam useEffect.

let cachedRaw: string | null | undefined;
let cachedUser: SessionUser | null = null;

/** Event internal untuk perubahan sesi di tab yang sama (storage event tidak fire di tab asal). */
const SESSION_CHANGE_EVENT = 'mjm_session_change';

function notifySessionChange(): void {
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

/** Subscribe perubahan sesi: antar-tab ("storage") & di tab yang sama (event internal). */
export function subscribeSession(notify: () => void): () => void {
  window.addEventListener('storage', notify);
  window.addEventListener(SESSION_CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener(SESSION_CHANGE_EVENT, notify);
  };
}

/** Snapshot sesi terkini di client (dengan cache referensi stabil). */
export function getSessionSnapshot(): SessionUser | null {
  const raw =
    typeof window === 'undefined' ? null : localStorage.getItem(SESSION_USER_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedUser = raw ? decodeSession(raw) : null;
  }
  return cachedUser;
}

/** Snapshot di server: selalu null (sesi hanya ada di browser). */
export function getServerSessionSnapshot(): SessionUser | null {
  return null;
}
