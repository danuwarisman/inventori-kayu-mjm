'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
}

export default function Header({ title = 'Dashboard', onSearch }: HeaderProps) {
  return (
    <header className="h-16 px-6 bg-white/80 border-b border-slate-200 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold text-green-700 font-sans tracking-tight">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search batch or log ID..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-56 md:w-64 pl-9 pr-4 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white rounded-full border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-green-700 transition-all"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-amber-600 rounded-full" />
        </button>
      </div>
    </header>
  );
}