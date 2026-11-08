import { type AppRole, normalizeRole } from '@/lib/session';

/**
 * Izin aksi per role (UI-level).
 *
 * Sistem Role Baru:
 * - Admin: Seluruh aksi operasional (Kayu Log, Sawmill, Dry Kiln, Supplier, Customer, Pembelian PO, Stok).
 * - Manager: Approval transaksi (Pembelian & Penjualan), Manajemen Akun Staf, Dashboard Finansial & Pengawasan.
 */
export type Permission =
  | 'log:create'
  | 'log:update'
  | 'log:delete'
  | 'sawmill:create'
  | 'sawmill:update'
  | 'sawmill:delete'
  | 'plank:create'
  | 'plank:update'
  | 'plank:delete'
  | 'dry-kiln:create'
  | 'dry-kiln:update'
  | 'dry-kiln:delete'
  | 'pra-dry-kiln:create'
  | 'pra-dry-kiln:update'
  | 'supplier:create'
  | 'supplier:update'
  | 'supplier:delete'
  | 'purchase:create'
  | 'purchase:update'
  | 'purchase:delete'
  | 'purchase:verify'
  | 'purchase:approve'
  | 'purchase:reject'
  | 'purchase:receive'
  | 'customer:create'
  | 'customer:update'
  | 'customer:delete'
  | 'sales:create'
  | 'sales:approve'
  | 'sales:reject'
  | 'stock:create'
  | 'account:create'
  | 'account:update'
  | 'settings:manage-data';

const ROLE_PERMISSIONS: Record<AppRole, ReadonlySet<Permission>> = {
  manager: new Set<Permission>([
    'purchase:approve',
    'purchase:reject',
    'sales:approve',
    'sales:reject',
    'account:create',
    'account:update',
    'settings:manage-data',
  ]),
  admin: new Set<Permission>([
    'log:create',
    'log:update',
    'log:delete',
    'sawmill:create',
    'sawmill:update',
    'sawmill:delete',
    'plank:create',
    'plank:update',
    'plank:delete',
    'dry-kiln:create',
    'dry-kiln:update',
    'dry-kiln:delete',
    'pra-dry-kiln:create',
    'pra-dry-kiln:update',
    'supplier:create',
    'supplier:update',
    'supplier:delete',
    'customer:create',
    'customer:update',
    'customer:delete',
    'purchase:create',
    'purchase:update',
    'purchase:delete',
    'purchase:verify',
    'purchase:receive',
    'sales:create',
    'stock:create',
    'settings:manage-data',
  ]),
};

/** Cek apakah role boleh melakukan aksi tertentu. `null`/role tak dikenal = false. */
export function can(
  role: string | null | undefined,
  permission: Permission
): boolean {
  if (!role) return false;
  const normalized = normalizeRole(role);
  if (!normalized) return false;
  return ROLE_PERMISSIONS[normalized]?.has(permission) ?? false;
}
