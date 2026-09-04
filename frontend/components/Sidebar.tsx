'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TreePine,
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
} from 'lucide-react';

export type AppRole = 'manager' | 'admin' | 'admin_kantor' | 'admin_lapangan';

interface SidebarProps {
  role?: AppRole;
  userName?: string;
  userRoleLabel?: string;
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
    href: (role) => (role === 'manager' ? '/manager-dashboard' : '/dashboard'),
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
    label: 'Suplier',
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
    label: 'Acount Management',
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
  role = 'admin',
  userName = 'Unknown 123',
  userRoleLabel,
}: SidebarProps) {
  const pathname = usePathname();

  const isManager = role === 'manager';
  const roleDisplayLabel =
    userRoleLabel || (isManager ? 'manager' : 'Office Admin');

  const visibleNavItems = navConfig
    .filter((item) => !item.managerOnly || isManager)
    .map((item) => ({
      label: item.label,
      href: item.href(role),
      icon: item.icon,
    }));

  return (
    <aside className="w-64 h-screen shrink-0 py-3 bg-slate-50 border-r border-slate-200 flex flex-col justify-between sticky top-0 select-none font-sans z-30">
      <div className="w-full flex flex-col">
        {/* Brand Header */}
        <div className="pl-2.5 pr-4 pb-6 flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-green-700/10 text-green-700 flex items-center justify-center shrink-0">
            <TreePine className="w-5 h-5 stroke-[2.2]" />
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

        {/* Navigation Items */}
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
                className={`w-full px-3 py-2 rounded-xs flex items-center gap-3 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-lime-600/10 border-r-4 border-green-700 text-green-700'
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
      </div>

      {/* Profile Footer */}
      <div className="w-full px-4">
        <div className="w-full p-2 bg-white rounded-sm border border-slate-200 flex items-center gap-3 shadow-2xs overflow-hidden">
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
    </aside>
  );
}