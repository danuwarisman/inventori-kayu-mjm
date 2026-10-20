'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Factory,
  Layers,
  Flame,
  BarChart3,
  Truck,
  ShoppingCart,
  Users,
  UserCog,
  Settings,
  X,
} from 'lucide-react';
import { AppRole, ROLE_LABELS, getDashboardPath } from '@/lib/session';

interface SidebarProps {
  role?: AppRole;
  userName?: string;
  userRoleLabel?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  href: (role: AppRole) => string;
  icon: React.ComponentType<{ className?: string }>;
  managerOnly?: boolean;
}

const navConfig: NavItem[] = [
  {
    label: 'Dashboard',
    href: (role) => getDashboardPath(role),
    icon: LayoutDashboard,
  },
  {
    label: 'Log',
    href: () => '/master-data',
    icon: FileText,
  },
  {
    label: 'Sawmill',
    href: () => '/sawmill',
    icon: Factory,
  },
  {
    label: 'Pra Dry Kiln',
    href: () => '/pra-dry-kiln',
    icon: Layers,
  },
  {
    label: 'Dry Kiln',
    href: () => '/dry-kiln',
    icon: Flame,
  },
  {
    label: 'Stock Reports',
    href: () => '/stock-reports',
    icon: BarChart3,
  },
  {
    label: 'Supplier',
    href: () => '/suppliers',
    icon: Truck,
  },
  {
    label: 'Sales',
    href: () => '/sales',
    icon: ShoppingCart,
  },
  {
    label: 'Customer',
    href: () => '/customers',
    icon: Users,
  },
  {
    label: 'Account Management',
    href: () => '/accounts',
    icon: UserCog,
    managerOnly: true,
  },
  {
    label: 'Settings',
    href: () => '/settings',
    icon: Settings,
  },
];

export default function Sidebar({
  role = 'admin_lapangan',
  userName = 'Unknown 123',
  userRoleLabel,
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const isManager = role === 'manager';
  const roleDisplayLabel = userRoleLabel || ROLE_LABELS[role];

  // Tutup drawer saat tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenMobile) {
        onCloseMobile?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  // Kunci scroll body saat drawer mobile terbuka
  useEffect(() => {
    if (isOpenMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpenMobile]);

  const visibleNavItems = navConfig
    .filter((item) => !item.managerOnly || isManager)
    .map((item) => ({
      label: item.label,
      href: item.href(role),
      icon: item.icon,
    }));

  const renderBrandHeader = (isMobile = false) => (
    <div className="pl-3 pr-3 pb-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-lg overflow-hidden bg-green-700/10 shrink-0">
          <Image
            src="/logoMJM.png"
            alt="Logo MargiJatiMakmur"
            width={36}
            height={36}
            className="w-full h-full object-contain p-0.5"
            priority
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-green-700 text-lg font-bold leading-tight truncate">
            MargiJatiMakmur
          </span>
          <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mt-0.5">
            INVENTORY CONTROL
          </span>
        </div>
      </div>
      {isMobile && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
          aria-label="Tutup navigasi"
          title="Tutup navigasi"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  const renderNavItems = (isMobile = false) => (
    <nav className="px-3 flex flex-col gap-1 w-full">
      {visibleNavItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' &&
            item.href !== '/manager-dashboard' &&
            pathname.startsWith(item.href));

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => {
              if (isMobile) {
                onCloseMobile?.();
              }
            }}
            className={`w-full px-3 py-2.5 rounded-md flex items-center gap-3 text-sm font-semibold transition-all ${
              isActive
                ? 'bg-lime-600/10 border-r-4 border-green-700 text-green-700 font-bold'
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-green-700' : 'text-slate-600'
              }`}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const renderProfileFooter = () => (
    <div className="w-full px-4 pt-3 pb-1">
      <div className="w-full p-2 bg-white rounded-md border border-slate-200 flex items-center gap-3 shadow-2xs overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-green-700/10 text-green-800 flex items-center justify-center text-xs font-bold shrink-0">
          {userName.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-stone-900 text-xs font-bold leading-4 truncate">
            {userName}
          </span>
          <span className="text-slate-500 text-[10px] font-normal leading-3 truncate">
            {roleDisplayLabel}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Permanent Sidebar (lg:flex, tersembunyi pada layar hp/tablet) */}
      <aside className="hidden lg:flex w-64 h-screen shrink-0 py-3 bg-slate-50 border-r border-slate-200 flex-col justify-between sticky top-0 select-none font-sans z-30">
        <div className="w-full flex flex-col flex-1 overflow-hidden">
          {renderBrandHeader(false)}
          <div className="flex-1 overflow-y-auto">
            {renderNavItems(false)}
          </div>
        </div>
        {renderProfileFooter()}
      </aside>

      {/* 2. Mobile & Tablet Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-40 transition-opacity duration-300 lg:hidden ${
          isOpenMobile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      {/* 3. Mobile & Tablet Off-Canvas Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] h-full py-4 bg-slate-50 border-r border-slate-200 flex flex-col justify-between z-50 select-none font-sans shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation Drawer"
        aria-hidden={!isOpenMobile}
      >
        <div className="w-full flex flex-col flex-1 overflow-hidden">
          {renderBrandHeader(true)}
          <div className="flex-1 overflow-y-auto">
            {renderNavItems(true)}
          </div>
        </div>
        {renderProfileFooter()}
      </aside>
    </>
  );
}