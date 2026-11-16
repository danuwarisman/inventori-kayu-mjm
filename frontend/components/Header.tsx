'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  X,
  Menu,
  CheckCheck,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Factory,
  Flame,
  ArrowUpRight,
  Compass,
  Package,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Users,
} from 'lucide-react';
import {
  customerApi,
  dryKilnApi,
  logApi,
  purchaseApi,
  salesApi,
  sawmillApi,
  supplierApi,
} from '@/lib/api';
import { ROLE_ACCESS, type AppRole } from '@/lib/session';
import useSessionUser from '@/lib/useSessionUser';
import { dispatchGlobalSearch } from '@/lib/useGlobalSearch';
import type { LogItem } from '@/types/log';
import type { SawmillItem } from '@/types/sawmill';
import type { DryKilnItem } from '@/types/dry-kiln';
import type { PurchaseOrder } from '@/types/purchase';
import type { SalesItem } from '@/types/sales';
import type { SupplierItem } from '@/types/supplier';
import type { CustomerItem } from '@/types/customer';

interface HeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
  onToggleMobileSidebar?: () => void;
}

type SearchCategory =
  | 'Menu'
  | 'Log'
  | 'Sawmill'
  | 'Dry-Kiln'
  | 'Pembelian'
  | 'Penjualan'
  | 'Supplier'
  | 'Customer';

interface GlobalSearchEntry {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle: string;
  badge?: string;
  href: string;
  searchText: string;
}

type NotificationPriority = 'urgent' | 'warning' | 'info' | 'success';

interface HeaderNotification {
  id: string;
  title: string;
  message: string;
  badge: string;
  priority: NotificationPriority;
  href: string;
}

interface HeaderDataSnapshot {
  logs: LogItem[];
  sawmills: SawmillItem[];
  dryKilns: DryKilnItem[];
  purchases: PurchaseOrder[];
  suppliers: SupplierItem[];
  customers: CustomerItem[];
  sales: SalesItem[];
  fetchedAt: number;
}

const EMPTY_SNAPSHOT: HeaderDataSnapshot = {
  logs: [],
  sawmills: [],
  dryKilns: [],
  purchases: [],
  suppliers: [],
  customers: [],
  sales: [],
  fetchedAt: 0,
};

const READ_NOTIFS_STORAGE_KEY = 'mjm_read_notifications_v1';
const SALES_STORAGE_KEY = 'mjm_sales_records_v1';
const CACHE_TTL_MS = 30_000;

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
  '/pembelian': 'Transaksi Pembelian',
  '/sales': 'Sales',
  '/customers': 'Customer',
  '/accounts': 'Account Management',
  '/settings': 'Settings',
};

const MENU_SEARCH_ITEMS: Array<{
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
}> = [
  {
    title: 'Dashboard Operasional',
    subtitle: 'Ringkasan produksi harian & quick entry log',
    href: '/dashboard',
    keywords: 'dashboard beranda home ringkasan',
  },
  {
    title: 'Dashboard Manager',
    subtitle: 'Statistik finansial, revenue, expenses, & profit',
    href: '/manager-dashboard',
    keywords: 'manager dashboard finansial keuangan profit revenue',
  },
  {
    title: 'Master Data Log',
    subtitle: 'Stok kayu gelondongan (log) & kirim ke sawmill',
    href: '/master-data',
    keywords: 'log kayu gelondongan master data',
  },
  {
    title: 'Data Sawmill & Plank',
    subtitle: 'Proses pembelahan log menjadi papan (plank)',
    href: '/sawmill',
    keywords: 'sawmill papan plank belah produksi',
  },
  {
    title: 'Data Pra Dry-Kiln',
    subtitle: 'Penataan palet kayu sebelum masuk oven',
    href: '/pra-dry-kiln',
    keywords: 'pra dry kiln palet sticking',
  },
  {
    title: 'Data Dry-Kiln (Oven)',
    subtitle: 'Pengeringan kadar air papan kayu',
    href: '/dry-kiln',
    keywords: 'dry kiln oven pengeringan kadar air',
  },
  {
    title: 'Stock Reports',
    subtitle: 'Laporan stok akhir & kayu siap jual',
    href: '/stock-reports',
    keywords: 'stock reports stok laporan gudang ready',
  },
  {
    title: 'Transaksi Pembelian (PO)',
    subtitle: 'Pengajuan PO, persetujuan Manager, & cetak PO',
    href: '/pembelian',
    keywords: 'pembelian po purchase order cetak approval',
  },
  {
    title: 'Penjualan (Sales)',
    subtitle: 'Transaksi penjualan, invoice, & surat jalan',
    href: '/sales',
    keywords: 'sales penjualan invoice surat jalan cetak',
  },
  {
    title: 'Data Supplier',
    subtitle: 'Daftar pemasok kayu log',
    href: '/suppliers',
    keywords: 'supplier pemasok vendor',
  },
  {
    title: 'Data Customer',
    subtitle: 'Daftar pelanggan & pembeli',
    href: '/customers',
    keywords: 'customer pelanggan pembeli',
  },
  {
    title: 'Account Management',
    subtitle: 'Kelola user, reset password, & status aktif staf',
    href: '/accounts',
    keywords: 'account manajemen akun user password staf',
  },
  {
    title: 'Settings',
    subtitle: 'Profil, export data laporan, & pengaturan sesi',
    href: '/settings',
    keywords: 'settings pengaturan profil export backup',
  },
];

function loadReadNotificationIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(READ_NOTIFS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function saveReadNotificationIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(READ_NOTIFS_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Abaikan jika penyimpanan browser penuh / dibatasi
  }
}

function loadLocalSalesFallback(): SalesItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SALES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as SalesItem[]) : [];
  } catch {
    return [];
  }
}

function formatRupiahCompact(amount: number): string {
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
}

function canAccessRoute(href: string, role?: AppRole | null): boolean {
  const allowed = ROLE_ACCESS[href];
  if (allowed === undefined || allowed === null) return true;
  if (!role) return false;
  return allowed.includes(role);
}

/**
 * Header global aplikasi: menampilkan judul halaman aktif, pencarian lintas
 * modul dengan dropdown hasil + filter tabel live, serta Notification Center.
 */
export default function Header({
  title,
  onSearch,
  onToggleMobileSidebar,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSessionUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<'all' | 'unread'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [snapshot, setSnapshot] = useState<HeaderDataSnapshot>(EMPTY_SNAPSHOT);
  const [readNotifIds, setReadNotifIds] = useState<string[]>(() =>
    loadReadNotificationIds()
  );

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  const fetchSnapshot = useCallback(async (force = false) => {
    const now = Date.now();
    if (
      !force &&
      snapshot.fetchedAt > 0 &&
      now - snapshot.fetchedAt < CACHE_TTL_MS
    ) {
      return;
    }

    const [
      logsRes,
      sawmillRes,
      dryKilnRes,
      purchaseRes,
      supplierRes,
      customerRes,
      salesRes,
    ] = await Promise.allSettled([
      logApi.list(),
      sawmillApi.list(),
      dryKilnApi.list(),
      purchaseApi.list(),
      supplierApi.list(),
      customerApi.list(),
      salesApi.list(),
    ]);

    const mappedApiSales: SalesItem[] =
      salesRes.status === 'fulfilled' && Array.isArray(salesRes.value)
        ? salesRes.value.map((order) => {
            const qty = (order.detailPenjualan ?? []).reduce(
              (sum, d) => sum + (d.kuantitasTerjual || 0),
              0
            );
            const total = order.totalHarga || 0;
            const unitPrice = qty > 0 ? Math.round(total / qty) : total;
            const status: SalesItem['status'] =
              order.statusPenjualan === 'DISETUJUI'
                ? 'Approved'
                : order.statusPenjualan === 'DITOLAK' ||
                  order.statusPenjualan === 'DIBATALKAN'
                ? 'Rejected'
                : 'Pending';
            return {
              id_transaksi: `TR-${String(order.idPenjualan).padStart(4, '0')}`,
              tanggal: order.tanggalJual
                ? order.tanggalJual.slice(0, 10)
                : '',
              nama_customer: order.customer?.namaCustomer || 'Customer',
              kuantitas: qty,
              harga_satuan: unitPrice,
              total_harga: total,
              status,
            };
          })
        : [];

    const localSales = loadLocalSalesFallback();

    setSnapshot({
      logs:
        logsRes.status === 'fulfilled' && Array.isArray(logsRes.value)
          ? logsRes.value
          : [],
      sawmills:
        sawmillRes.status === 'fulfilled' && Array.isArray(sawmillRes.value)
          ? sawmillRes.value
          : [],
      dryKilns:
        dryKilnRes.status === 'fulfilled' && Array.isArray(dryKilnRes.value)
          ? dryKilnRes.value
          : [],
      purchases:
        purchaseRes.status === 'fulfilled' && Array.isArray(purchaseRes.value)
          ? purchaseRes.value
          : [],
      suppliers:
        supplierRes.status === 'fulfilled' && Array.isArray(supplierRes.value)
          ? supplierRes.value
          : [],
      customers:
        customerRes.status === 'fulfilled' && Array.isArray(customerRes.value)
          ? customerRes.value
          : [],
      sales: mappedApiSales.length > 0 ? mappedApiSales : localSales,
      fetchedAt: Date.now(),
    });
  }, [snapshot.fetchedAt]);

  // Muat ringkasan awal secara asinkron untuk badge notifikasi
  useEffect(() => {
    let active = true;
    Promise.allSettled([
      logApi.list(),
      sawmillApi.list(),
      dryKilnApi.list(),
      purchaseApi.list(),
      supplierApi.list(),
      customerApi.list(),
      salesApi.list(),
    ]).then(
      ([
        logsRes,
        sawmillRes,
        dryKilnRes,
        purchaseRes,
        supplierRes,
        customerRes,
        salesRes,
      ]) => {
        if (!active) return;

        const mappedApiSales: SalesItem[] =
          salesRes.status === 'fulfilled' && Array.isArray(salesRes.value)
            ? salesRes.value.map((order) => {
                const qty = (order.detailPenjualan ?? []).reduce(
                  (sum, d) => sum + (d.kuantitasTerjual || 0),
                  0
                );
                const total = order.totalHarga || 0;
                const unitPrice = qty > 0 ? Math.round(total / qty) : total;
                const status: SalesItem['status'] =
                  order.statusPenjualan === 'DISETUJUI'
                    ? 'Approved'
                    : order.statusPenjualan === 'DITOLAK' ||
                      order.statusPenjualan === 'DIBATALKAN'
                    ? 'Rejected'
                    : 'Pending';
                return {
                  id_transaksi: `TR-${String(order.idPenjualan).padStart(4, '0')}`,
                  tanggal: order.tanggalJual
                    ? order.tanggalJual.slice(0, 10)
                    : '',
                  nama_customer: order.customer?.namaCustomer || 'Customer',
                  kuantitas: qty,
                  harga_satuan: unitPrice,
                  total_harga: total,
                  status,
                };
              })
            : [];

        const localSales = loadLocalSalesFallback();

        setSnapshot({
          logs:
            logsRes.status === 'fulfilled' && Array.isArray(logsRes.value)
              ? logsRes.value
              : [],
          sawmills:
            sawmillRes.status === 'fulfilled' && Array.isArray(sawmillRes.value)
              ? sawmillRes.value
              : [],
          dryKilns:
            dryKilnRes.status === 'fulfilled' && Array.isArray(dryKilnRes.value)
              ? dryKilnRes.value
              : [],
          purchases:
            purchaseRes.status === 'fulfilled' && Array.isArray(purchaseRes.value)
              ? purchaseRes.value
              : [],
          suppliers:
            supplierRes.status === 'fulfilled' && Array.isArray(supplierRes.value)
              ? supplierRes.value
              : [],
          customers:
            customerRes.status === 'fulfilled' && Array.isArray(customerRes.value)
              ? customerRes.value
              : [],
          sales: mappedApiSales.length > 0 ? mappedApiSales : localSales,
          fetchedAt: Date.now(),
        });
      }
    );

    return () => {
      active = false;
    };
  }, [pathname]);

  // Tutup dropdown saat klik di luar area atau menekan Escape
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setIsSearchOpen(false);
      }
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(target)
      ) {
        setIsNotifOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getPageTitle = (): string => {
    if (title) return title;
    if (routeTitleMap[pathname]) return routeTitleMap[pathname];

    const matchedRoute = Object.keys(routeTitleMap).find(
      (route) =>
        route !== '/dashboard' &&
        route !== '/manager-dashboard' &&
        pathname.startsWith(route)
    );

    return matchedRoute ? routeTitleMap[matchedRoute] : 'Dashboard';
  };

  // Susun indeks pencarian lintas modul
  const searchIndex = useMemo<GlobalSearchEntry[]>(() => {
    const entries: GlobalSearchEntry[] = [];

    for (const menu of MENU_SEARCH_ITEMS) {
      if (!canAccessRoute(menu.href, user?.role)) continue;
      entries.push({
        id: `menu-${menu.href}`,
        category: 'Menu',
        title: menu.title,
        subtitle: menu.subtitle,
        badge: 'Halaman',
        href: menu.href,
        searchText: `${menu.title} ${menu.subtitle} ${menu.keywords}`.toLowerCase(),
      });
    }

    for (const log of snapshot.logs) {
      entries.push({
        id: `log-${log.id_log}`,
        category: 'Log',
        title: log.id_log,
        subtitle: `${log.sortimen} • ${log.panjang}x${log.diameter} cm • ${log.suplier || '-'}`,
        badge: log.stage,
        href: '/master-data',
        searchText: `${log.id_log} ${log.sortimen} ${log.suplier || ''} ${log.stage}`.toLowerCase(),
      });
    }

    for (const sm of snapshot.sawmills) {
      const plankCodes = sm.planks.map((p) => p.id_plank).join(' ');
      entries.push({
        id: `sawmill-${sm.id_sawmill}`,
        category: 'Sawmill',
        title: sm.id_sawmill,
        subtitle: `Asal: ${sm.id_log_asal} • ${sm.sortimen} • ${sm.planks.length} plank`,
        badge: sm.stage,
        href: '/sawmill',
        searchText: `${sm.id_sawmill} ${sm.id_log_asal} ${sm.sortimen} ${sm.suplier || ''} ${sm.stage} ${plankCodes}`.toLowerCase(),
      });
    }

    for (const dk of snapshot.dryKilns) {
      entries.push({
        id: `drykiln-${dk.id_plank}`,
        category: 'Dry-Kiln',
        title: dk.id_plank,
        subtitle: `Log ${dk.id_log} • ${dk.sortimen} • ${dk.grade}`,
        badge: dk.stage,
        href: '/dry-kiln',
        searchText: `${dk.id_plank} ${dk.id_log} ${dk.sortimen} ${dk.grade} ${dk.stage}`.toLowerCase(),
      });
    }

    for (const po of snapshot.purchases) {
      const poCode = `PO-${String(po.idPembelian).padStart(4, '0')}`;
      const supplierName = po.supplier?.namaSupplier || 'Supplier';
      entries.push({
        id: `po-${po.idPembelian}`,
        category: 'Pembelian',
        title: `${poCode} — ${supplierName}`,
        subtitle: `${formatRupiahCompact(po.totalHarga || 0)} • ${po.tanggalBeli?.slice(0, 10) || ''}`,
        badge: po.statusPembelian,
        href: '/pembelian',
        searchText: `${poCode} ${supplierName} ${po.statusPembelian} pembelian`.toLowerCase(),
      });
    }

    for (const sale of snapshot.sales) {
      entries.push({
        id: `sales-${sale.id_transaksi}`,
        category: 'Penjualan',
        title: `${sale.id_transaksi} — ${sale.nama_customer}`,
        subtitle: `${sale.kuantitas} pcs • ${formatRupiahCompact(sale.total_harga)}`,
        badge: sale.status,
        href: '/sales',
        searchText: `${sale.id_transaksi} ${sale.nama_customer} ${sale.status} penjualan`.toLowerCase(),
      });
    }

    for (const sup of snapshot.suppliers) {
      entries.push({
        id: `sup-${sup.id_supplier}`,
        category: 'Supplier',
        title: sup.nama_supplier,
        subtitle: `${sup.id_supplier} • ${sup.kontak_supplier}`,
        badge: 'Supplier',
        href: '/suppliers',
        searchText: `${sup.id_supplier} ${sup.nama_supplier} ${sup.alamat_supplier} ${sup.kontak_supplier}`.toLowerCase(),
      });
    }

    for (const cust of snapshot.customers) {
      entries.push({
        id: `cust-${cust.id_customer}`,
        category: 'Customer',
        title: cust.nama,
        subtitle: `${cust.id_customer} • ${cust.no_hp}`,
        badge: 'Customer',
        href: '/customers',
        searchText: `${cust.id_customer} ${cust.nama} ${cust.alamat} ${cust.no_hp}`.toLowerCase(),
      });
    }

    return entries;
  }, [snapshot, user?.role]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchIndex.filter((item) => item.searchText.includes(q)).slice(0, 12);
  }, [searchIndex, searchQuery]);

  // Susun daftar notifikasi operasional & manajerial riil
  const notifications = useMemo<HeaderNotification[]>(() => {
    const items: HeaderNotification[] = [];

    const pendingPos = snapshot.purchases.filter(
      (po) => po.statusPembelian === 'MENUNGGU'
    );
    if (pendingPos.length > 0) {
      const latest = pendingPos[0];
      const poCode = `PO-${String(latest.idPembelian).padStart(4, '0')}`;
      items.push({
        id: `po-pending-${pendingPos.length}-${latest.idPembelian}`,
        title: `${pendingPos.length} PO Menunggu Approval Manager`,
        message: `Terbaru: ${poCode} (${latest.supplier?.namaSupplier || 'Supplier'}). Menunggu verifikasi untuk masuk ke Stok Log.`,
        badge: 'Urgent',
        priority: 'urgent',
        href: '/pembelian',
      });
    }

    const pendingSales = snapshot.sales.filter((s) => s.status === 'Pending');
    if (pendingSales.length > 0) {
      const latest = pendingSales[0];
      items.push({
        id: `sales-pending-${pendingSales.length}-${latest.id_transaksi}`,
        title: `${pendingSales.length} Transaksi Penjualan Pending`,
        message: `Terbaru: ${latest.id_transaksi} (${latest.nama_customer} • ${formatRupiahCompact(latest.total_harga)}).`,
        badge: 'Pending',
        priority: 'warning',
        href: '/sales',
      });
    }

    if (snapshot.fetchedAt > 0) {
      const availableLogs = snapshot.logs.filter(
        (l) => l.stage === 'Log'
      ).length;
      if (availableLogs < 5) {
        items.push({
          id: `low-stock-log-${availableLogs}`,
          title:
            availableLogs === 0
              ? 'Stok Kayu Log Kosong'
              : `Stok Kayu Log Menipis (${availableLogs} Batang)`,
          message:
            'Jumlah kayu log mentah siap gergaji di bawah batas minimal (5 batang). Ajukan PO baru bila diperlukan.',
          badge: 'Stok',
          priority: 'warning',
          href: '/master-data',
        });
      }
    }

    const activeSawmills = snapshot.sawmills.filter(
      (s) => s.stage === 'Sawmill'
    ).length;
    if (activeSawmills > 0) {
      items.push({
        id: `active-sawmill-${activeSawmills}`,
        title: `${activeSawmills} Batch Sedang Proses Sawmill`,
        message:
          'Kayu log sedang dalam antrean pembelahan menjadi papan (plank).',
        badge: 'Sawmill',
        priority: 'info',
        href: '/sawmill',
      });
    }

    const activeKilns = snapshot.dryKilns.filter(
      (d) => d.stage === 'in-drykiln'
    ).length;
    if (activeKilns > 0) {
      items.push({
        id: `active-drykiln-${activeKilns}`,
        title: `${activeKilns} Papan Dalam Oven Dry-Kiln`,
        message:
          'Proses pengeringan aktif berlangsung. Perbarui status menjadi selesai jika kadar air sudah memenuhi standar.',
        badge: 'Dry-Kiln',
        priority: 'info',
        href: '/dry-kiln',
      });
    }

    const approvedPos = snapshot.purchases.filter(
      (po) => po.statusPembelian === 'DISETUJUI'
    ).length;
    if (approvedPos > 0) {
      items.push({
        id: `po-approved-${approvedPos}`,
        title: `${approvedPos} PO Pembelian Disetujui`,
        message:
          'Stok kayu log dari seluruh PO yang telah di-ACC Manager tercatat otomatis di Data Log.',
        badge: 'Disetujui',
        priority: 'success',
        href: '/pembelian',
      });
    }

    return items;
  }, [snapshot]);

  const readSet = useMemo(() => new Set(readNotifIds), [readNotifIds]);
  const unreadCount = useMemo(
    () => notifications.filter((n) => !readSet.has(n.id)).length,
    [notifications, readSet]
  );

  const visibleNotifications = useMemo(
    () =>
      notifTab === 'unread'
        ? notifications.filter((n) => !readSet.has(n.id))
        : notifications,
    [notifTab, notifications, readSet]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearchOpen(Boolean(value.trim()));
    dispatchGlobalSearch(value);
    onSearch?.(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
    dispatchGlobalSearch('');
    onSearch?.('');
  };

  const handleSelectSearchResult = (item: GlobalSearchEntry) => {
    setIsSearchOpen(false);
    if (item.category === 'Menu') {
      setSearchQuery('');
      dispatchGlobalSearch('');
      onSearch?.('');
    } else {
      dispatchGlobalSearch(searchQuery);
    }
    if (pathname !== item.href) {
      router.push(item.href);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault();
      handleSelectSearchResult(searchResults[0]);
    }
  };

  const markNotifRead = (id: string) => {
    if (readSet.has(id)) return;
    const next = [...readNotifIds, id];
    setReadNotifIds(next);
    saveReadNotificationIds(next);
  };

  const handleMarkAllRead = () => {
    const next = Array.from(
      new Set([...readNotifIds, ...notifications.map((n) => n.id)])
    );
    setReadNotifIds(next);
    saveReadNotificationIds(next);
  };

  const handleToggleNotif = () => {
    const nextOpen = !isNotifOpen;
    setIsNotifOpen(nextOpen);
    setIsSearchOpen(false);
    if (nextOpen) {
      fetchSnapshot(false).catch(() => {});
    }
  };

  const handleRefreshNotifs = async () => {
    setIsRefreshing(true);
    try {
      await fetchSnapshot(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderCategoryIcon = (category: SearchCategory) => {
    switch (category) {
      case 'Menu':
        return <Compass className="w-3.5 h-3.5 text-stone-500" />;
      case 'Log':
        return <Package className="w-3.5 h-3.5 text-green-700" />;
      case 'Sawmill':
        return <Factory className="w-3.5 h-3.5 text-amber-700" />;
      case 'Dry-Kiln':
        return <Flame className="w-3.5 h-3.5 text-orange-600" />;
      case 'Pembelian':
        return <ShoppingBag className="w-3.5 h-3.5 text-blue-700" />;
      case 'Penjualan':
        return <ShoppingCart className="w-3.5 h-3.5 text-emerald-700" />;
      case 'Supplier':
        return <Truck className="w-3.5 h-3.5 text-stone-600" />;
      case 'Customer':
        return <Users className="w-3.5 h-3.5 text-teal-700" />;
    }
  };

  const renderNotifStyle = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent':
        return {
          wrap: 'bg-rose-100 text-rose-700',
          badge: 'bg-rose-100 text-rose-700 border-rose-200',
          icon: <AlertTriangle className="w-4 h-4" />,
        };
      case 'warning':
        return {
          wrap: 'bg-amber-100 text-amber-700',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <Clock className="w-4 h-4" />,
        };
      case 'info':
        return {
          wrap: 'bg-blue-100 text-blue-700',
          badge: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <Factory className="w-4 h-4" />,
        };
      case 'success':
        return {
          wrap: 'bg-emerald-100 text-emerald-700',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
    }
  };

  return (
    <header className="h-16 px-3 sm:px-6 bg-white/90 border-b border-slate-200 backdrop-blur-[6px] sticky top-0 z-30 flex items-center justify-between gap-2 sm:gap-4 font-sans select-none">
      {/* Tombol Hamburger & Judul Halaman Dinamis */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="p-2 -ml-1 text-slate-600 hover:text-green-700 hover:bg-slate-100 rounded-lg lg:hidden transition-colors cursor-pointer shrink-0"
          aria-label="Buka menu navigasi"
          title="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-2xl font-semibold text-green-700 tracking-tight truncate font-['Manrope']">
          {getPageTitle()}
        </h1>
      </div>

      {/* Bagian Kanan: Global Search Bar & Notification Center */}
      <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0">
        {/* Global Search Input + Results Dropdown */}
        <div ref={searchContainerRef} className="relative flex items-center">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari log, PO, menu..."
            aria-label="Pencarian global lintas modul"
            value={searchQuery}
            onFocus={() => {
              fetchSnapshot(false).catch(() => {});
              if (searchQuery.trim()) setIsSearchOpen(true);
            }}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            className="w-36 sm:w-56 md:w-64 lg:w-72 pl-8 sm:pl-9 pr-7 py-2 text-xs bg-slate-100 hover:bg-slate-200/60 focus:bg-white rounded-xl border border-slate-200 text-stone-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 transition-all font-['Manrope']"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 p-0.5 text-stone-400 hover:text-stone-700 rounded-full transition-colors cursor-pointer"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Dropdown Hasil Pencarian Lintas Modul */}
          {isSearchOpen && searchQuery.trim() !== '' && (
            <div className="fixed inset-x-3 top-[68px] sm:inset-x-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-[420px] bg-white rounded-xl border border-stone-200 shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="px-3.5 py-2 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                <span>
                  Hasil pencarian untuk{' '}
                  <strong className="text-stone-800">
                    &ldquo;{searchQuery.trim()}&rdquo;
                  </strong>
                </span>
                <span className="font-semibold text-green-700">
                  {searchResults.length} ditemukan
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="px-4 py-8 text-center flex flex-col items-center gap-1.5 text-stone-400">
                  <Search className="w-6 h-6 stroke-[1.5]" />
                  <p className="text-xs font-semibold text-stone-600">
                    Tidak ada data yang cocok
                  </p>
                  <p className="text-[11px]">
                    Coba kata kunci ID Log, nomor PO, nama supplier, customer, atau nama menu.
                  </p>
                </div>
              ) : (
                <ul className="max-h-[380px] overflow-y-auto divide-y divide-stone-100">
                  {searchResults.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full px-3.5 py-2.5 text-left hover:bg-green-50/70 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                            {renderCategoryIcon(item.category)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-stone-900 truncate">
                                {item.title}
                              </span>
                              <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded bg-stone-100 text-stone-600 border border-stone-200 shrink-0">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-800 border border-green-200">
                              {item.badge}
                            </span>
                          )}
                          <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Tombol Lonceng & Notification Center Popover */}
        <div ref={notifContainerRef} className="relative">
          <button
            type="button"
            onClick={handleToggleNotif}
            aria-label="Notifications"
            aria-expanded={isNotifOpen}
            className={`w-9 h-9 flex items-center justify-center rounded-full border transition-colors relative cursor-pointer shrink-0 ${
              isNotifOpen
                ? 'bg-green-50 text-green-800 border-green-300'
                : 'text-slate-500 hover:text-green-800 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-600 text-white text-[10px] font-bold rounded-full ring-2 ring-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="fixed inset-x-3 top-[68px] sm:inset-x-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-[390px] bg-white rounded-xl border border-stone-200 shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150">
              {/* Header Popover */}
              <div className="px-4 py-3 bg-orange-50/70 border-b border-stone-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900">
                    Notifikasi Sistem
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="px-2 py-1 text-[11px] font-semibold text-green-700 hover:bg-green-100/70 rounded flex items-center gap-1 cursor-pointer transition-colors"
                      title="Tandai semua notifikasi sebagai dibaca"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Tandai dibaca</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleRefreshNotifs}
                    disabled={isRefreshing}
                    className="p-1.5 text-stone-500 hover:text-green-700 hover:bg-stone-200/60 rounded cursor-pointer transition-colors disabled:opacity-50"
                    title="Muat ulang notifikasi"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Tab Filter Notifikasi */}
              <div className="px-4 py-2 bg-stone-50 border-b border-stone-200 flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setNotifTab('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                    notifTab === 'all'
                      ? 'bg-green-700 text-white'
                      : 'text-stone-600 hover:bg-stone-200/70'
                  }`}
                >
                  Semua ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setNotifTab('unread')}
                  className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                    notifTab === 'unread'
                      ? 'bg-green-700 text-white'
                      : 'text-stone-600 hover:bg-stone-200/70'
                  }`}
                >
                  Belum Dibaca ({unreadCount})
                </button>
              </div>

              {/* Daftar Notifikasi */}
              {visibleNotifications.length === 0 ? (
                <div className="px-5 py-9 text-center flex flex-col items-center gap-1.5 text-stone-400">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 stroke-[1.75]" />
                  <p className="text-xs font-semibold text-stone-700">
                    {notifTab === 'unread'
                      ? 'Semua notifikasi sudah dibaca'
                      : 'Belum ada pemberitahuan baru'}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Aktivitas PO, penjualan, dan produksi akan muncul di sini.
                  </p>
                </div>
              ) : (
                <ul className="max-h-[360px] overflow-y-auto divide-y divide-stone-100">
                  {visibleNotifications.map((notif) => {
                    const isRead = readSet.has(notif.id);
                    const style = renderNotifStyle(notif.priority);
                    return (
                      <li key={notif.id}>
                        <button
                          type="button"
                          onClick={() => {
                            markNotifRead(notif.id);
                            setIsNotifOpen(false);
                            if (pathname !== notif.href) {
                              router.push(notif.href);
                            }
                          }}
                          className={`w-full px-4 py-3 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                            isRead
                              ? 'bg-white hover:bg-stone-50'
                              : 'bg-orange-50/40 hover:bg-orange-50/80'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${style.wrap}`}
                          >
                            {style.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-stone-900 truncate">
                                {notif.title}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border shrink-0 ${style.badge}`}
                              >
                                {notif.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">
                              {notif.message}
                            </p>
                          </div>

                          {!isRead && (
                            <span
                              className="w-2 h-2 rounded-full bg-amber-600 shrink-0 mt-1.5"
                              title="Belum dibaca"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
