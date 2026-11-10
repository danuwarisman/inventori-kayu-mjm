'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  LifeBuoy,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  saveSession,
  saveAccessToken,
  normalizeRole,
  getDashboardPath,
  AppRole,
} from '@/lib/session';
import { authApi, getApiErrorMessage } from '@/lib/api';

/** Akun hardcode sementara untuk keperluan demo dan presentasi progres */
interface HardcodedAccount {
  id: number;
  username: string;
  fullName: string;
  role: AppRole;
  passwords: string[];
}

const HARDCODED_ACCOUNTS: Record<string, HardcodedAccount> = {
  admin: {
    id: 2,
    username: 'admin',
    fullName: 'Admin MJM',
    role: 'admin',
    passwords: ['admin', 'admin123', 'password', '123456'],
  },
  manager: {
    id: 1,
    username: 'manager',
    fullName: 'Manager MJM',
    role: 'manager',
    passwords: ['manager', 'admin', 'admin123', 'password', '123456'],
  },
  // Alias lama untuk kompatibilitas
  admin_kantor: {
    id: 2,
    username: 'admin',
    fullName: 'Admin MJM',
    role: 'admin',
    passwords: ['admin', 'admin123', 'password', '123456'],
  },
  lapangan: {
    id: 2,
    username: 'admin',
    fullName: 'Admin MJM',
    role: 'admin',
    passwords: ['lapangan', 'admin', 'admin123', 'password', '123456'],
  },
  admin_lapangan: {
    id: 2,
    username: 'admin',
    fullName: 'Admin MJM',
    role: 'admin',
    passwords: ['lapangan', 'admin', 'admin123', 'password', '123456'],
  },
};

/** Helper token dummy valid untuk sesi UI demo offline */
function createMockJwt(id: number, username: string, role: string): string {
  if (typeof window === 'undefined') return 'mock-jwt-token';
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: id,
      username,
      role: role.toUpperCase(),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
    })
  );
  return `${header}.${payload}.mock-signature-for-presentation`;
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const completeLogin = (
    userId: number,
    uname: string,
    fullName: string,
    role: AppRole,
    token: string
  ) => {
    saveAccessToken(token);
    saveSession({
      id: userId,
      username: uname,
      fullName,
      role,
    });

    const redirectCookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith('mjm_redirect='))
      ?.split('=')[1];
    document.cookie = 'mjm_redirect=; path=/; max-age=0; samesite=lax';

    if (redirectCookie && redirectCookie.startsWith('/') && !redirectCookie.startsWith('/login')) {
      router.push(redirectCookie);
    } else {
      router.push(getDashboardPath(role));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError('');
    setIsLoading(true);

    const cleanUsername = username.trim();
    const lowerUser = cleanUsername.toLowerCase();
    const demoUser = HARDCODED_ACCOUNTS[lowerUser];

    // 1. Prioritas utama: Autentikasi langsung ke backend NestJS agar mendapatkan token JWT riil
    try {
      const data = await authApi.login(cleanUsername, password);
      const role = normalizeRole(data.user.role);
      if (!role) {
        setError(
          `Role akun "${data.user.role}" tidak dikenali oleh aplikasi. ` +
            'Hubungi administrator untuk memperbaiki data role.'
        );
        setIsLoading(false);
        return;
      }

      completeLogin(data.user.id, data.user.username, data.user.nama, role, data.accessToken);
      return;
    } catch (err: unknown) {
      // 2. Fallback offline: jika backend tidak terhubung sama sekali dan akun demo cocok
      const isConnectionIssue =
        err instanceof Error &&
        (err.message.includes('Tidak bisa menghubungi backend') ||
          err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError'));

      if (
        isConnectionIssue &&
        demoUser &&
        (demoUser.passwords.includes(password) ||
          password === 'admin' ||
          password === 'admin123' ||
          password === lowerUser)
      ) {
        console.warn('Backend tidak terjangkau, menggunakan sesi demo offline');
        const mockToken = createMockJwt(demoUser.id, demoUser.username, demoUser.role);
        completeLogin(demoUser.id, demoUser.username, demoUser.fullName, demoUser.role, mockToken);
        return;
      }

      setError(
        getApiErrorMessage(
          err,
          'Username atau password salah. Gunakan username: admin atau manager (password: admin123)'
        )
      );
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-stone-100 via-stone-200/70 to-stone-300/80 overflow-hidden">
      {/* Background Decorative Circle Backdrop dari Figma */}
      <div className="pointer-events-none absolute -top-48 -right-48 w-[800px] h-[800px] rounded-full bg-green-800/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-48 w-[700px] h-[700px] rounded-full bg-amber-700/[0.04] blur-3xl" />

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-[480px] flex flex-col items-center gap-4">
        <div className="w-full bg-white rounded-lg shadow-xl shadow-stone-300/40 border border-stone-200/80 p-8 flex flex-col gap-6">
          {/* Logo & Identity */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-green-800/10 flex items-center justify-center mb-3">
              <Image
                src="/logoMJM.png"
                alt="Logo MargiJatiMakmur"
                width={56}
                height={56}
                className="w-full h-full object-contain p-1"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-green-800 font-sans tracking-tight">
              MargiJatiMakmur
            </h1>
            <p className="text-sm text-stone-600 font-normal mt-0.5">
              Wood Inventory Management System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Security Notice Banner */}
            <div className="px-3.5 py-2.5 bg-orange-50/90 border border-amber-200/60 rounded-md flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-green-800 shrink-0" />
              <span className="text-xs text-stone-700 font-medium">
                Secure Role-Based Access Enabled
              </span>
            </div>

            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-700 tracking-wide uppercase">
                Username
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  maxLength={50}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="admin / manager"
                  className="w-full pl-9 pr-3 py-2.5 bg-transparent border-b border-stone-300 text-stone-900 text-sm focus:border-green-800 focus:outline-none transition-colors placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-700 tracking-wide uppercase">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  maxLength={100}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 bg-transparent border-b border-stone-300 text-stone-900 text-sm focus:border-green-800 focus:outline-none transition-colors placeholder:text-stone-400 tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  aria-pressed={showPassword}
                  className="absolute right-2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Pesan error login (kredensial salah, backend mati, role tak dikenal) */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-md flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="text-xs text-red-700 font-medium">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-3 px-4 bg-green-800 hover:bg-green-900 active:scale-[0.99] text-white text-sm font-medium rounded-md shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
            >
              <span>{isLoading ? 'Authenticating...' : 'Authenticate Access'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Accounts Helper for Presentation */}
            <div className="mt-2 pt-3 border-t border-stone-200 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span className="font-semibold flex items-center gap-1 text-stone-700">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Akun Demo Presentasi:
                </span>
                <span className="font-mono text-stone-400">Pass: admin123</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin', 'admin123')}
                  className="py-2 px-3 text-xs font-semibold rounded-md border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 text-stone-700 transition-colors text-center cursor-pointer flex flex-col items-center gap-0.5"
                  title="Admin: Akses Operasional, Produksi & Pengadaan"
                >
                  <span className="font-bold">Admin</span>
                  <span className="text-[10px] text-stone-400 font-normal">Operasional & Produksi</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('manager', 'admin123')}
                  className="py-2 px-3 text-xs font-semibold rounded-md border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 text-stone-700 transition-colors text-center cursor-pointer flex flex-col items-center gap-0.5"
                  title="Manager: Akses Dashboard Finansial & Approval"
                >
                  <span className="font-bold">Manager</span>
                  <span className="text-[10px] text-stone-400 font-normal">Finansial & Approval</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer: info statis, tanpa indikator status server palsu */}
        <div className="w-full px-2 flex flex-wrap justify-between items-center gap-2 text-xs text-stone-500">
          <span>
            &copy; {new Date().getFullYear()} MargiJatiMakmur
          </span>

          <span className="flex items-center gap-1.5">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Butuh bantuan? Hubungi administrator</span>
          </span>
        </div>
      </div>
    </main>
  );
}
