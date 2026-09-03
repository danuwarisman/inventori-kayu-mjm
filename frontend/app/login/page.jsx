'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TreePine,
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  Factory,
  Briefcase,
  ArrowRight,
  LifeBuoy,
  CheckCircle2,
} from 'lucide-react';

type PortalType = 'operational' | 'managerial';

export default function LoginPage() {
  const router = useRouter();
  const [portal, setPortal] = useState<PortalType>('operational');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi autentikasi & routing sesuai role portal
    setTimeout(() => {
      setIsLoading(false);
      if (portal === 'managerial') {
        router.push('/manager-dashboard');
      } else {
        router.push('/dashboard');
      }
    }, 600);
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
            <div className="w-14 h-14 rounded-xl bg-green-800/10 text-green-800 flex items-center justify-center mb-3">
              <TreePine className="w-8 h-8 stroke-[2.2]" />
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

            {/* Portal Selector */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-xs font-medium text-stone-500">
                Select Access Portal
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPortal('operational')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md border text-sm font-medium transition-all ${
                    portal === 'operational'
                      ? 'bg-green-800/10 border-green-800 text-green-800 shadow-xs'
                      : 'bg-white border-stone-300 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Factory className="w-4 h-4 shrink-0" />
                  <span>Operational</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPortal('managerial')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md border text-sm font-medium transition-all ${
                    portal === 'managerial'
                      ? 'bg-green-800/10 border-green-800 text-green-800 shadow-xs'
                      : 'bg-white border-stone-300 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>Managerial</span>
                </button>
              </div>
            </div>

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