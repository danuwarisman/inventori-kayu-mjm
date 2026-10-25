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
} from 'lucide-react';
import {
  saveSession,
  saveAccessToken,
  normalizeRole,
  getDashboardPath,
} from '@/lib/session';
import { authApi, getApiErrorMessage } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError('');
    setIsLoading(true);

    try {
      // Autentikasi ke backend NestJS (POST /auth/login).
      const data = await authApi.login(username.trim(), password);

      // Backend mengirim nama role uppercase (mis. "ADMIN KANTOR");
      // UI memakai bentuk snake_case.
      const role = normalizeRole(data.user.role);
      if (!role) {
        setError(
          `Role akun "${data.user.role}" tidak dikenali oleh aplikasi. ` +
            'Hubungi administrator untuk memperbaiki data role.'
        );
        return;
      }

      // Simpan JWT (dipakai sebagai Bearer token oleh api client) dan sesi UI
      // (cookie role untuk middleware + profil untuk Sidebar/Header).
      saveAccessToken(data.accessToken);
      saveSession({
        username: data.user.username,
        fullName: data.user.nama,
        role,
      });

      // Kembali ke halaman yang sempat dituju sebelum diarahkan ke login
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
    } catch (err) {
      // 401 dari /auth/login = username/password salah (pesan dari backend).
      setError(getApiErrorMessage(err, 'Login gagal. Silakan coba lagi.'));
    } finally {
      setIsLoading(false);
    }
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
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-9 pr-3 py-2.5 bg-transparent border-b border-stone-300 text-stone-900 text-sm focus:border-green-800 focus:outline-none transition-colors placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-stone-700 tracking-wide uppercase">
                  Password
                </label>
                <a
                  href="#forgot"
                  className="text-xs font-medium text-amber-800 hover:text-amber-900 hover:underline transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  maxLength={100}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 bg-transparent border-b border-stone-300 text-stone-900 text-sm focus:border-green-800 focus:outline-none transition-colors placeholder:text-stone-400 tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 text-stone-400 hover:text-stone-600 p-1"
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
          </form>
        </div>

        {/* Footer Meta Status */}
        <div className="w-full px-2 flex justify-between items-center text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="font-medium text-stone-700">Server: Online</span>
          </div>

          <a
            href="#support"
            className="flex items-center gap-1.5 text-stone-500 hover:text-stone-700 transition-colors"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Technical Support</span>
          </a>
        </div>
      </div>
    </main>
  );
}