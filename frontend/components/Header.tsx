'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, X } from 'lucide-react';

interface HeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
}

// Pemetaan judul otomatis berdasarkan rute halaman aktif
const routeTitleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/manager-dashboard': 'Dashboard',
  '/master-data': 'Data Log',
  '/sawmill': 'Data Sawmill',
  '/pra-dry-kiln': 'Data Pra Dry-kiln',
  '/dry-kiln': 'Data Dry-Kiln',
  '/stock-reports': 'Stock Reports',
  '/suppliers': 'Supplier',
  '/sales': 'Sales',
  '/customers': 'Customer',
  '/accounts': 'Acount Management',
  '/settings': 'Settings',
};

export default function Header({ title, onSearch }: HeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  // Menentukan judul: memprioritaskan prop title, lalu membaca pathname
  const getPageTitle = (): string => {
    if (title) return title;
    if (routeTitleMap[pathname]) return routeTitleMap[pathname];

    // Cek kecocokan awalan rute untuk nested route
    const matchedRoute = Object.keys(routeTitleMap).find(
      (route) =>
        route !== '/dashboard' &&
        route !== '/manager-dashboard' &&
        pathname.startsWith(route)
    );

    return matchedRoute ? routeTitleMap[matchedRoute] : 'Dashboard';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch?.('');
  };

  return (
    <header className="h-16 px-6 bg-white/80 border-b border-slate-200 backdrop-blur-[6px] sticky top-0 z-20 flex items-center justify-between gap-4 font-sans select-none">
      {/* Judul Halaman Dinamis */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-semibold text-green-700 tracking-tight truncate font-['Manrope']">
          {getPageTitle()}
        </h1>
      </div>

      {/* Bagian Kanan: Search Bar & Notifikasi */}
      <div className="flex items-center justify-end gap-4 md:gap-6">
        {/* Search Bar Input */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search batch or log ID..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-48 sm:w-56 md:w-64 pl-10 pr-8 py-2 text-xs bg-slate-100 hover:bg-slate-200/60 focus:bg-white rounded-xl border border-slate-200 text-stone-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 transition-all font-['Manrope']"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 p-0.5 text-stone-400 hover:text-stone-700 rounded-full transition-colors cursor-pointer"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tombol Lonceng Notifikasi dengan Indikator Badge */}
        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:text-green-800 hover:bg-slate-100 border border-slate-200 transition-colors relative cursor-pointer shrink-0"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-amber-600 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}