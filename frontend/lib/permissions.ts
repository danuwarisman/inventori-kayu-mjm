import type { AppRole } from '@/lib/session';

/**
 * Izin aksi per role (UI-level).
 *
 * Sumber aturan:
 * - SDD `Menginput Data Kayu`: Admin Lapangan.
 * - SDD `Mengubah Data Kayu`: Admin Lapangan + Admin Kantor.
 * - SDD `Input Data Customer`: Admin Lapangan.
 * - SDD `Input/Mengubah Data Supplier`: Admin Kantor.
 * - SDD `Input Data Penjualan`: Admin Lapangan.
 * - SDD `Approval Data Penjualan`: Manager.
 * - SDD `Mengubah Data Admin` / Account Management: Manager.
 *
 * Catatan:
 * - Ini hanya guard UI. Otorisasi final tetap harus di backend.
 * - Manager sengaja read-only untuk data operasional.
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
    'sales:approve',
    'sales:reject',
    'account:create',
    'account:update',
    'settings:manage-data',
  ]),
  admin_kantor: new Set<Permission>([
    'log:update',
    'log:delete',
    'supplier:create',
    'supplier:update',
    'supplier:delete',
    'settings:manage-data',
  ]),
  admin_lapangan: new Set<Permission>([
    'log:create',
    'log:update',
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
    'customer:create',
    'customer:update',
    'customer:delete',
    'sales:create',
    'stock:create',
  ]),
};

/** Cek apakah role boleh melakukan aksi tertentu. `null`/role tak dikenal = false. */
export function can(
  role: AppRole | null | undefined,
  permission: Permission
): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}
